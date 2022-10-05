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
        this.data[id] = data
        return data
    }

    public getById(id: string) {
        return this.data[id]
    }

    public listAll() {
        return Object.values(this.data);
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