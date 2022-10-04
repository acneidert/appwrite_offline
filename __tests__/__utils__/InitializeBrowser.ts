import { JSDOM } from 'jsdom';
import { configIndexedDb } from './IndexedDb';

export const InitializeBrowser = () => {
  const url = 'http://localhost';
  const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', { url });
  (global.window as any) = {
    ...dom.window,
    ...configIndexedDb,
  };
  global = {
    ...global,
    ...configIndexedDb,
  };
};
