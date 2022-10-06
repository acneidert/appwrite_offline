import { Databases as DatabasesAppWrite, ID } from 'appwrite';
import { AppwriteException, Client } from 'appwrite';
import { v4 as uuidv4 } from 'uuid';
import minimongo from 'minimongo';
import { parseQuery } from '../util/QueryUtil';
import type { Payload } from 'appwrite/types';
import type { Models } from 'appwrite/types';
import type { Databases as IDatabasesAppWrite } from 'appwrite/types';

export type typeDatabase = IDatabasesAppWrite & {
  _getCollection(collectionId: string, databaseId: string): Promise<any[]>;
  listDocuments<Document extends Models.Document>(
    databaseId: string,
    collectionId: string,
    queries?: any[],
  ): Promise<Models.DocumentList<Document>>;
  sync(databaseId: string, collectionId: string): void;
};

const CONTENT_TYPE = { 'content-type': 'application/json' };

export class Databases extends DatabasesAppWrite {
  db = null;

  constructor(client: Client) {
    super(client);
  }

  async sync(databaseId: string, collectionId: string) {
    const [collection] = await this._getCollection(collectionId, databaseId);
    const nonSynced = await collection.find({ '___meta.___synced': false }).fetch();
    console.log('nonSynced', nonSynced);
    // console.log('allDocs', allDocs);
  }

  async _getCollection(collectionId: string, databaseId: string) {
    if (this.db === null) {
      const IndexedDb = minimongo.IndexedDb;
      this.db = await new Promise((resolve, reject) => {
        new IndexedDb(
          { namespace: databaseId },
          (db) => {
            resolve(db);
          },
          (error) => {
            reject(error);
          },
        );
      });
    }
    if (!this.db.getCollectionNames().includes(collectionId)) {
      await new Promise((resolve, reject) => {
        this.db.addCollection(
          collectionId,
          () => {
            resolve(true);
          },
          () => {
            reject(new Error('Error on add Collection'));
          },
        );
      });
    }
    return [this.db.collections[collectionId], this.db];
  }

  /**
   * List Documents
   *
   * Get a list of all the user's documents in a given collection. You can use
   * the query params to filter your results. On admin mode, this endpoint will
   * return a list of all of documents belonging to the provided collectionId.
   * [Learn more about different API modes](/docs/admin).
   *
   * @param {string} databaseId
   * @param {string} collectionId
   * @param {string[]} queries
   * @throws {AppwriteException}
   * @returns {Promise}
   */
  async listDocuments<Document extends Models.Document>(
    databaseId: string,
    collectionId: string,
    queries?: any[],
  ): Promise<Models.DocumentList<Document>> {
    if (typeof databaseId === 'undefined') {
      throw new AppwriteException('Missing required parameter: "databaseId"');
    }

    if (typeof collectionId === 'undefined') {
      throw new AppwriteException('Missing required parameter: "collectionId"');
    }

    const [collection] = await this._getCollection(collectionId, databaseId);

    let path = '/databases/{databaseId}/collections/{collectionId}/documents'
      .replace('{databaseId}', databaseId)
      .replace('{collectionId}', collectionId);
    let payload: Payload = {};

    let localQuery = {
      '___meta.___deleted': false,
    };

    if (typeof queries !== 'undefined') {
      payload['queries'] = queries.map((qry) => (typeof qry === 'string' ? qry : qry()));
      for (const query of queries) {
        const qry = typeof query === 'string' ? parseQuery(query) : query(true);
        localQuery = {
          ...localQuery,
          ...qry,
        };
      }
    }

    try {
      const uri = new URL(this.client.config.endpoint + path);
      const call = await this.client.call('get', uri, CONTENT_TYPE, payload);
      for (const document of call.documents) {
        let doc = await collection.findOne({ '___meta.documentId': document.$id }, {});
        doc.___meta.___synced = true;
        doc = {
          ...doc,
          ...document,
        };
        await collection.upsert(doc);
      }
      return call;
    } catch (error) {
      const allDocs = await collection.find(localQuery).fetch();
      const documents = [];
      for (const doc of allDocs) {
        documents.push(doc);
      }
      return { total: allDocs.length, documents };
    }
  }

  /**
   * Create Document
   *
   * Create a new Document. Before using this route, you should create a new
   * collection resource using either a [server
   * integration](/docs/server/databases#databasesCreateCollection) API or
   * directly from your database console.
   *
   * @param {string} databaseId
   * @param {string} collectionId
   * @param {string} documentId
   * @param {Omit<Document, keyof Models.Document>} data
   * @param {string[]} permissions
   * @throws {AppwriteException}
   * @returns {Promise}
   */
  async createDocument<Document extends Models.Document>(
    databaseId: string,
    collectionId: string,
    documentId: string,
    data: Omit<Document, keyof Models.Document>,
    permissions?: string[],
  ): Promise<Document> {
    if (typeof databaseId === 'undefined') {
      throw new AppwriteException('Missing required parameter: "databaseId"');
    }

    if (typeof collectionId === 'undefined') {
      throw new AppwriteException('Missing required parameter: "collectionId"');
    }

    if (typeof documentId === 'undefined') {
      throw new AppwriteException('Missing required parameter: "documentId"');
    }

    if (typeof data === 'undefined') {
      throw new AppwriteException('Missing required parameter: "data"');
    }

    if (documentId === 'unique()') {
      documentId = uuidv4();
    }

    const [collection] = await this._getCollection(collectionId, databaseId);

    const inserted = await collection.upsert({
      ...data,
      $collectionId: collectionId,
      $createdAt: new Date().toISOString(),
      $databaseId: databaseId,
      $id: documentId,
      $permissions: [],
      $updatedAt: new Date().toISOString(),
      ___meta: {
        documentId,
        ___deleted: false,
        ___created: new Date().toISOString(),
        ___synced: false,
      },
    });

    let path = '/databases/{databaseId}/collections/{collectionId}/documents'
      .replace('{databaseId}', databaseId)
      .replace('{collectionId}', collectionId);
    let payload: Payload = {};

    if (typeof documentId !== 'undefined') {
      payload['documentId'] = documentId;
    }

    if (typeof data !== 'undefined') {
      payload['data'] = data;
    }

    if (typeof permissions !== 'undefined') {
      payload['permissions'] = permissions;
    }

    const uri = new URL(this.client.config.endpoint + path);
    try {
      const call = await this.client.call('post', uri, CONTENT_TYPE, payload);
      let doc = await collection.findOne({ '___meta.documentId': documentId }, {});
      doc.___meta.___synced = true;
      doc = {
        ...doc,
        ...call,
      };
      await collection.upsert(doc);
      return call;
    } catch (e) {
      return inserted;
    }
  }

  /**
   * Get Document
   *
   * Get a document by its unique ID. This endpoint response returns a JSON
   * object with the document data.
   *
   * @param {string} databaseId
   * @param {string} collectionId
   * @param {string} documentId
   * @throws {AppwriteException}
   * @returns {Promise}
   */
  async getDocument<Document extends Models.Document>(
    databaseId: string,
    collectionId: string,
    documentId: string,
  ): Promise<Document> {
    if (typeof databaseId === 'undefined') {
      throw new AppwriteException('Missing required parameter: "databaseId"');
    }

    if (typeof collectionId === 'undefined') {
      throw new AppwriteException('Missing required parameter: "collectionId"');
    }

    if (typeof documentId === 'undefined') {
      throw new AppwriteException('Missing required parameter: "documentId"');
    }

    let path = '/databases/{databaseId}/collections/{collectionId}/documents/{documentId}'
      .replace('{databaseId}', databaseId)
      .replace('{collectionId}', collectionId)
      .replace('{documentId}', documentId);
    let payload: Payload = {};
    const [collection] = await this._getCollection(collectionId, databaseId);
    try {
      const uri = new URL(this.client.config.endpoint + path);
      const call = await this.client.call('get', uri, CONTENT_TYPE, payload);
      let doc = await collection.findOne({ '___meta.documentId': documentId }, {});
      doc.___meta.___synced = true;
      doc = {
        ...doc,
        ...call,
      };
      await collection.upsert(doc);
      return call;
    } catch (error) {
      return await collection.findOne({ '___meta.documentId': documentId }, { '___meta.___deleted': false });
    }
  }

  /**
   * Update Document
   *
   * Update a document by its unique ID. Using the patch method you can pass
   * only specific fields that will get updated.
   *
   * @param {string} databaseId
   * @param {string} collectionId
   * @param {string} documentId
   * @param {Partial<Omit<Document, keyof Models.Document>>} data
   * @param {string[]} permissions
   * @throws {AppwriteException}
   * @returns {Promise}
   */
  async updateDocument<Document extends Models.Document>(
    databaseId: string,
    collectionId: string,
    documentId: string,
    data?: Partial<Omit<Document, keyof Models.Document>>,
    permissions?: string[],
  ): Promise<Document> {
    if (typeof databaseId === 'undefined') {
      throw new AppwriteException('Missing required parameter: "databaseId"');
    }

    if (typeof collectionId === 'undefined') {
      throw new AppwriteException('Missing required parameter: "collectionId"');
    }

    if (typeof documentId === 'undefined') {
      throw new AppwriteException('Missing required parameter: "documentId"');
    }

    let path = '/databases/{databaseId}/collections/{collectionId}/documents/{documentId}'
      .replace('{databaseId}', databaseId)
      .replace('{collectionId}', collectionId)
      .replace('{documentId}', documentId);
    let payload: Payload = {};

    if (typeof data !== 'undefined') {
      payload['data'] = data;
    }

    if (typeof permissions !== 'undefined') {
      payload['permissions'] = permissions;
    }
    const [collection] = await this._getCollection(collectionId, databaseId);
    try {
      const uri = new URL(this.client.config.endpoint + path);
      const call = await this.client.call('patch', uri, CONTENT_TYPE, payload);
      let doc = await collection.findOne({ '___meta.documentId': documentId }, {});
      doc.___meta.___synced = true;
      doc.___created = new Date().toISOString();
      doc = {
        ...doc,
        ...call,
      };
      await collection.upsert(doc);
      return call;
    } catch (error) {
      let doc = await collection.findOne({ '___meta.documentId': documentId }, {});
      doc.___meta.___synced = false;
      doc.___created = new Date().toISOString();
      doc = {
        ...doc,
        ...data,
      };
      await collection.upsert(doc);
      return doc;
    }
  }

  /**
   * Delete Document
   *
   * Delete a document by its unique ID.
   *
   * @param {string} databaseId
   * @param {string} collectionId
   * @param {string} documentId
   * @throws {AppwriteException}
   * @returns {Promise}
   */
  async deleteDocument(databaseId: string, collectionId: string, documentId: string): Promise<{}> {
    if (typeof databaseId === 'undefined') {
      throw new AppwriteException('Missing required parameter: "databaseId"');
    }

    if (typeof collectionId === 'undefined') {
      throw new AppwriteException('Missing required parameter: "collectionId"');
    }

    if (typeof documentId === 'undefined') {
      throw new AppwriteException('Missing required parameter: "documentId"');
    }

    let path = '/databases/{databaseId}/collections/{collectionId}/documents/{documentId}'
      .replace('{databaseId}', databaseId)
      .replace('{collectionId}', collectionId)
      .replace('{documentId}', documentId);
    let payload: Payload = {};
    const [collection] = await this._getCollection(collectionId, databaseId);
    try {
      const uri = new URL(this.client.config.endpoint + path);
      const call = await this.client.call('delete', uri, CONTENT_TYPE, payload);
      const doc = await collection.findOne({ '___meta.documentId': documentId }, {});
      await collection.remove(doc._id);
      return call;
    } catch (error) {
      const doc = await collection.findOne({ '___meta.documentId': documentId }, {});
      doc.___meta.___deleted = true;
      await collection.upsert(doc);
    }
  }
}
