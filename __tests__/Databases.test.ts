import { ResProm } from './__utils__/ResProm';
import { getAppwriteConn } from './__utils__/AppwriteConn';
import { InitializeBrowser } from './__utils__/InitializeBrowser';
import { Query, Account } from '../index';

// TODO: 
//    * Pagination Test

beforeAll(async () => {
  InitializeBrowser();

  // Test Online
  //
  // const { client } = getAppwriteConn();
  // const account = new Account(client);
  // const promise = account.createEmailSession('andre@neidert.com.br', 'senha123');
  // await ResProm(promise)
});

describe('With Online Actions', () => {
  test('It Create a Document', async () => {
    // const { databases } = getAppwriteConn('http://167.71.241.25/v1');
    const { databases } = getAppwriteConn();
    const changeAt_ = new Date().toISOString();
    const promise = databases.createDocument('teste', 'col_teste', 'online_00', {
      nome: 'Teste',
      obs: 'Teste Obs',
      changeAt_,
    });
    const prom = await ResProm(promise);
    expect(Object.prototype.hasOwnProperty.call(prom, '___meta')).not.toBeTruthy();
  });

  test('It Returns document, with Given Id', async () => {
    const { databases } = getAppwriteConn();
    const promisse = databases.getDocument('teste', 'col_teste', 'online_00');
    const ret = (await ResProm(promisse)) as { $id: string };
    expect(ret.$id).toBe('online_00');
    expect(Object.prototype.hasOwnProperty.call(ret, '___meta')).not.toBeTruthy();
  });

  test('It List All Documents without Query', async () => {
    const { databases } = getAppwriteConn();
    const promise = databases.listDocuments('teste', 'col_teste');
    const ret = (await ResProm(promise)) as { total: number; documents: Array<any> };
    expect(ret.documents).toHaveLength(1);
    expect(Object.prototype.hasOwnProperty.call(ret.documents[0], '___meta')).not.toBeTruthy();
  });

  test('It List All Documents with Query', async () => {
    const { databases } = getAppwriteConn();
    const promise = databases.listDocuments('teste', 'col_teste', [Query.equal('nome', 'Teste')]);
    const ret = (await ResProm(promise)) as { total: number; documents: Array<any> };
    expect(ret.documents).toHaveLength(1);
    expect(Object.prototype.hasOwnProperty.call(ret.documents[0], '___meta')).not.toBeTruthy();
  });
  
  test('It Update Document', async () => {
    const { databases } = getAppwriteConn();
    const prom = databases.updateDocument('teste', 'col_teste', 'online_00', {
      nome: 'Changed',
    });
    const ret = (await ResProm(prom)) as { nome: string };
    expect(ret.nome).toEqual('Changed');
    expect(Object.prototype.hasOwnProperty.call(ret, '___meta')).not.toBeTruthy();
  });

  test('It Delete the Document, Given Id', async () => {
    const { databases } = getAppwriteConn();
    const deleteDocument = databases.deleteDocument('teste', 'col_teste', 'online_00');
    await ResProm(deleteDocument);
    const findDocument = databases.getDocument('teste', 'col_teste', 'online_00');
    const thisMustBeEmpty = await ResProm(findDocument);
    expect(thisMustBeEmpty).toBeNull();
  })
});

describe('With Offline Actions', () => {
  test('It Create a Document', async () => {
    const { client, databases }: { databases: any; client: any } = getAppwriteConn();
    client.offline = true;
    const changeAt_ = new Date().toISOString();
    const promise = databases.createDocument('teste', 'col_teste', 'offline_00', {
      nome: 'Teste',
      obs: 'Teste Obs',
      changeAt_,
    });
    const offlineObject: any = await ResProm(promise);
    expect(Object.prototype.hasOwnProperty.call(offlineObject, '___meta')).toBeTruthy();
  });

  test('It Returns document, with Given Id', async () => {
    const { client, databases }: { databases: any; client: any } = getAppwriteConn();
    client.offline = true;
    const promisse = databases.getDocument('teste', 'col_teste', 'offline_00');
    const ret = (await ResProm(promisse)) as { $id: string };
    expect(ret.$id).toBe('offline_00');
    expect(Object.prototype.hasOwnProperty.call(ret, '___meta')).toBeTruthy();
  });

  test('It Checks if there is any document in IndexedDb', async () => {
    const { databases } = getAppwriteConn();
    const [collection] = await databases._getCollection('col_teste', 'teste');
    const allDocs = await collection.find({}).fetch();
    expect(allDocs.length).toBeGreaterThan(0);
  });

  test('It List All Documents without Query', async () => {
    const { client, databases }: { databases: any; client: any } = getAppwriteConn();
    client.offline = true;
    const promise = databases.listDocuments('teste', 'col_teste');
    const ret = (await ResProm(promise)) as { total: number; documents: Array<any> };
    expect(ret.documents).toHaveLength(1);
    expect(Object.prototype.hasOwnProperty.call(ret.documents[0], '___meta')).toBeTruthy();
  });

  test('It List All Documents with Query', async () => {
    const { client, databases }: { databases: any; client: any } = getAppwriteConn();
    client.offline = true;
    const promise = databases.listDocuments('teste', 'col_teste', [Query.equal('nome', 'Teste')]);
    const ret = (await ResProm(promise)) as { total: number; documents: Array<any> };
    expect(ret.documents).toHaveLength(1);
    expect(Object.prototype.hasOwnProperty.call(ret.documents[0], '___meta')).toBeTruthy();
  });
  
  test('It Update Document', async () => {
    const { client, databases }: { databases: any; client: any } = getAppwriteConn();
    client.offline = true;
    const prom = databases.updateDocument('teste', 'col_teste', 'offline_00', {
      nome: 'Changed',
    });
    const ret = (await ResProm(prom)) as { nome: string };
    expect(ret.nome).toEqual('Changed');
    expect(Object.prototype.hasOwnProperty.call(ret, '___meta')).toBeTruthy();
  });

  test('It Delete the Document, Given Id', async () => {
    const { client, databases }: { databases: any; client: any } = getAppwriteConn();
    client.offline = true;
    const deleteDocument = databases.deleteDocument('teste', 'col_teste', 'offline_00');
    await ResProm(deleteDocument);
    const findDocument = databases.getDocument('teste', 'col_teste', 'offline_00');
    const thisMustBeEmpty = (await ResProm(findDocument)) as {___meta : {___deleted: boolean, ___synced: boolean}} ;
    expect(thisMustBeEmpty.___meta.___deleted).toBeTruthy();
    expect(thisMustBeEmpty.___meta.___synced).toBeFalsy();
  })
});

describe('Synchronization', ()=>{
  beforeAll(async () => {
    const { client, databases }: { databases: any; client: any } = getAppwriteConn();
    const changeAt_ = new Date().toISOString();
    for(let i = 0 ; i < 10 ; i++ ) {
      client.offline = (i % 2 === 0);
      const promise = databases.createDocument('teste', 'col_teste', 'offline_0' + i, {
        nome: 'Teste ' + i,
        obs: 'Teste Obs',
        changeAt_,
      });
      await ResProm(promise);
    }
  });
  
  test('It Retrieves Local data Unsynchronizided', async () => {
    const { client, databases }: { databases: any; client: any } = getAppwriteConn();
    client.offline = true;
    await databases.sync('teste', 'col_teste')
  })

  test('It Sync Local Data with Remote Data', async () => {
    
  })
})
