import { Client, Databases } from '../../index';

import type { Client as tClient } from 'appwrite';
import { typeDatabase } from '../../src/service/databases';

const ENDPOINT = 'http://localhost/v1';
const PROJECT = 'offline';

type objProps = {
  client: null | tClient;
  databases: null | typeDatabase;
};
const obj: objProps = {
  client: null,
  databases: null,
};

export const getAppwriteConn = (
  endpoint: string | null = null,
  project: string | null = null,
): { client: tClient; databases: typeDatabase } => {
  if (!obj.client) obj.client = new Client();
  if (!obj.databases) obj.databases = new Databases(obj.client);

  obj.client.setEndpoint(endpoint || ENDPOINT).setProject(project || PROJECT);

  return obj;
};
