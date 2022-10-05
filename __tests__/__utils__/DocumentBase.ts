export const DocumentBase = (database: string, collection: string, id: string, data: {}) => ({
    ...data,
    $id: id,
    $permissions: [
      'read("user:00000000000000000000")',
      'update("user:00000000000000000000")',
      'delete("user:00000000000000000000")',
    ],
    $createdAt: new Date(0, 0, 0).toISOString(),
    $updatedAt: new Date(0, 0, 0).toISOString(),
    $collectionId: collection,
    $databaseId: database,
})