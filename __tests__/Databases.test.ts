import { ID } from '../index';
import { ResProm } from './__utils__/ResProm';
import { getAppwriteConn } from './__utils__/AppwriteConn';
import { InitializeBrowser } from './__utils__/InitializeBrowser';

beforeAll(() => {
  InitializeBrowser();
});

test('Create a Document', async () => {
  const { databases } = getAppwriteConn();

  const changeAt_ = new Date().toISOString();
  const promise = databases.createDocument('teste', 'col_teste', ID.unique(), {
    nome: 'Teste',
    obs: 'Teste Obs',
    changeAt_,
  });
  const resp = await ResProm(promise);
  expect(resp).toMatchObject({
    nome: 'Teste',
    obs: 'Teste Obs',
    changeAt_,
    $id: '00000000000000000000',
    $permissions: [
      'read("user:00000000000000000000")',
      'update("user:00000000000000000000")',
      'delete("user:00000000000000000000")',
    ],
    $createdAt: new Date(0, 0, 0).toISOString(),
    $updatedAt: new Date(0, 0, 0).toISOString(),
    $collectionId: 'col_teste',
    $databaseId: 'teste',
  });
});
