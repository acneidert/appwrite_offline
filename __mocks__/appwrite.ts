import { Client as AppClient, Payload } from 'appwrite';

type Headers = {
  [key: string]: string;
};

class Client extends AppClient {
  async call(method: string, url: URL, headers: Headers = {}, params: Payload = {}): Promise<any> {
    const arrayUrl = url.href.split('/')
    const collection = arrayUrl[arrayUrl.length - 2]
    const database = arrayUrl[arrayUrl.length - 4]
    return {
      ...params.data,
      '$id': '00000000000000000000',
      '$permissions': [
        'read("user:00000000000000000000")',
        'update("user:00000000000000000000")',
        'delete("user:00000000000000000000")'
      ],
      '$createdAt': new Date(0,0,0).toISOString(),
      '$updatedAt': new Date(0,0,0).toISOString(),
      '$collectionId': collection,
      '$databaseId': database
    }
  }
}
export { Client };
export { Query, AppwriteException } from 'appwrite';
export { Account } from 'appwrite';
export { Avatars } from 'appwrite';
export { Databases } from 'appwrite';
export { Functions } from 'appwrite';
export { Locale } from 'appwrite';
export { Storage } from 'appwrite';
export { Teams } from 'appwrite';
export type { Models, Payload, RealtimeResponseEvent, UploadProgress } from 'appwrite';
export type { QueryTypes, QueryTypesList } from 'appwrite';
export { Permission } from 'appwrite';
export { Role } from 'appwrite';
export { ID } from 'appwrite';