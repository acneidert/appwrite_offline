const operators = {
    equal: (attribute, value) => (doc) => {
      if (value instanceof Array) return value.includes(doc[attribute]);
      return doc[attribute] === value;
    },
  };
/**
 * The MemoryDb class defines the `getInstance` method that lets clients access
 * the unique MemoryDb instance.
 */
 export class MemoryDb {
    private static instance: MemoryDb;
    private data: Object = {};
    /**
     * The MemoryDb's constructor should always be private to prevent direct
     * construction calls with the `new` operator.
     */
    private constructor() { }

    /**
     * The static method that controls the access to the MemoryDb instance.
     *
     * This implementation let you subclass the MemoryDb class while keeping
     * just one instance of each subclass around.
     */
    public static getInstance(): MemoryDb {
        if (!MemoryDb.instance) {
            MemoryDb.instance = new MemoryDb();
        }

        return MemoryDb.instance;
    }

    public add(id: string, data: object) {
        this.data[id] = {...data, '$__from': 'database'}
        return this.data[id] 
    }

    public getById(id: string) {
        return this.data[id]
    }

    public listAll(queries: string[] | null = null) {
        const filters: Function[] = [];
        if (queries) {
          queries.forEach((qry: string) => {
            filters.push(this._parseQuery(qry));
          })
        }
        function filter(doc) {
          if (filters.length > 0) {
              filters.forEach((filt: Function) => {
                if (!filt(doc)) return false;
              })
          }
          return true;
        }
        return {
            total: Object.values(this.data).filter(filter).length, 
            documents: Object.values(this.data).filter(filter),
        };
    }

    private _parseQuery(query: string): Function {
        const rgxMethod = /(.*?)(?=\()/g;
        const rgxValues = /(?<=\[)(.*?)(?=\])/g;
        const rgxAttribute = /(?<=\(")(.*?)(?=\")/g;
        const method = (query.match(rgxMethod) || [''])[0];
        const values = (query.match(rgxValues) || [''])[0]
          .split(',')
          .map((qry) => qry.replaceAll('"', ''));
        const attribute = (query.match(rgxAttribute) || [''])[0];
        return operators[method](attribute, values);
      }

    public update(id: string, data: object) {
        this.data[id] = {
            ...this.data[id],
            ...data
        }
        return this.data[id]
    }

    public delete(id: string) {
        delete this.data[id];
    }
}