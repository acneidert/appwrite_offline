import { Client, Databases } from '../../index';

import type { Databases as tDatabases } from 'appwrite';
import type { Client as tClient } from 'appwrite';

const ENDPOINT = 'http://localhost/v1';
const PROJECT = 'offline';

type objProps = {
  client: null | tClient;
  databases: null | tDatabases;
};
const obj: objProps = {
  client: null,
  databases: null,
};

export const getAppwriteConn = (
  endpoint: string | null = null,
  project: string | null = null,
): { client: tClient; databases: tDatabases } => {
  if (!obj.client) obj.client = new Client();
  if (!obj.databases) obj.databases = new Databases(obj.client);

  obj.client.setEndpoint(endpoint || ENDPOINT).setProject(project || PROJECT);

  return obj;
};
