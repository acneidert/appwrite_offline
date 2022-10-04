import { Client, Databases } from '../../index';

const ENDPOINT = 'http://localhost/v1';
const PROJECT = 'offline';

type objProps = {
  client: null | any;
  databases: null | any;
};
const obj: objProps = {
  client: null,
  databases: null,
};

export const getAppwriteConn = (endpoint: string | null = null, project: string | null = null) => {
  if (!obj.client) obj.client = new Client();
  if (!obj.databases) obj.databases = new Databases(obj.client);
  
  obj.client.setEndpoint(endpoint || ENDPOINT).setProject(project || PROJECT);

  return obj;
};
