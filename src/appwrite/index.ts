import { Client, Query as QryAppwrite, AppwriteException, QueryTypes } from 'appwrite';
class Query {
  static equal = (attribute: string, value: QueryTypes) => {
    return (minimongo: boolean = false) => {
      if (!minimongo) return QryAppwrite.equal(attribute, value);
      const obj = {};
      if (value instanceof Array) {
        obj[attribute] = { $in: value };
      } else {
        obj[attribute] = value;
      }
      return obj;
    };
  };
  static notEqual = (attribute: string, value: QueryTypes) => {
    return (minimongo: boolean = false) => {
      if (!minimongo) return QryAppwrite.notEqual(attribute, value);
      const obj = {};
      if (value instanceof Array) {
        obj[attribute] = { $nin: value };
      } else {
        obj[attribute] = { $ne : value };
      }
      return obj;
    };
  };
  
  static lessThan = (attribute: string, value: QueryTypes) => {
    return (minimongo: boolean = false) => {
      if (!minimongo) return QryAppwrite.lessThan(attribute, value);
    };
  };
  static lessThanEqual = (attribute: string, value: QueryTypes) => {
    return (minimongo: boolean = false) => {
      if (!minimongo) return QryAppwrite.lessThanEqual(attribute, value);
    };
  };
  static greaterThan = (attribute: string, value: QueryTypes) => {
    return (minimongo: boolean = false) => {
      if (!minimongo) return QryAppwrite.greaterThan(attribute, value);
    };
  };
  static greaterThanEqual = (attribute: string, value: QueryTypes) => {
    return (minimongo: boolean = false) => {
      if (!minimongo) return QryAppwrite.greaterThanEqual(attribute, value);
    };
  };
  static search = (attribute: string, value: string) => {
    return (minimongo: boolean = false) => {
      if (!minimongo) return QryAppwrite.search(attribute, value);
    };
  };
  static orderDesc = (attribute: string) => {
    return (minimongo: boolean = false) => {
      if (!minimongo) return QryAppwrite.orderDesc(attribute);
    };
  };
  static orderAsc = (attribute: string) => {
    return (minimongo: boolean = false) => {
      if (!minimongo) return QryAppwrite.orderAsc(attribute);
    };
  };
  static cursorAfter = (documentId: string) => {
    return (minimongo: boolean = false) => {
      if (!minimongo) return QryAppwrite.cursorAfter(documentId);
    };
  };
  static cursorBefore = (documentId: string) => {
    return (minimongo: boolean = false) => {
      if (!minimongo) return QryAppwrite.cursorBefore(documentId);
    };
  };
  static limit = (limit: number) => {
    return (minimongo: boolean = false) => {
      if (!minimongo) return QryAppwrite.limit(limit);
    };
  };
  static offset = (offset: number) => {
    return (minimongo: boolean = false) => {
      if (!minimongo) return QryAppwrite.offset(offset);
    };
  };
}

export { Query, Client, AppwriteException };
