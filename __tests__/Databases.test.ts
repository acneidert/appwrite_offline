import { ID } from '../index';
import { ResProm } from './__utils__/ResProm';
import { getAppwriteConn } from './__utils__/AppwriteConn';
import { InitializeBrowser } from './__utils__/InitializeBrowser';
import { DocumentBase } from './__utils__/DocumentBase';

beforeAll(() => {
  InitializeBrowser();
});

describe('Online Actions', () => {
  test('Create a Document', async () => {
    const { databases } = getAppwriteConn();
  
    const changeAt_ = new Date().toISOString();
  
    const promise = databases.createDocument('teste', 'col_teste', ID.unique(), {
      nome: 'Teste',
      obs: 'Teste Obs',
      changeAt_,
    });
  
    // return all documents online
    expect(await ResProm(promise)).toMatchObject(
      DocumentBase('teste', 'col_teste', {
        nome: 'Teste',
        obs: 'Teste Obs',
        changeAt_,
      }),
    );

  });

  test('List All Documents without Query', async () => {
    const { databases } = getAppwriteConn();
    const promise = databases.listDocuments('teste', 'col_teste');
    const ret = ( await ResProm(promise) as {total: number, documents: Array<any>});
    expect(ret.documents).toHaveLength(1);
  })
})


describe('Offline Actions', () => {
  test('Create a Document', async () => {
    const { client, databases }: {databases: any, client: any}  = getAppwriteConn();
    client.offline = true;
    const changeAt_ = new Date().toISOString();
    const promise = databases.createDocument('teste', 'col_teste', '0', {
      nome: 'Teste',
      obs: 'Teste Obs',
      changeAt_,
    });
    const offlineObject: any = await ResProm(promise);
    expect(Object.prototype.hasOwnProperty.call(offlineObject, '___synced')).toBeTruthy();
  });

  test('List All Documents', async () => {
    const { databases }: {databases: any} = getAppwriteConn();
    const [collection] = await databases._getCollection('col_teste', 'teste');
    const allDocs = await collection.find({}).fetch();
    expect(allDocs.length).toBeGreaterThan(0);
  });
})
