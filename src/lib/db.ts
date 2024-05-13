import Base, { Table } from 'dexie';

export interface Text {
  id?: number;
  content: string;
}

export class Dexie extends Base {
  texts!: Table<Text>;

  constructor() {
    super('editor');
    this.version(1).stores({
      texts: '++id, content'
    });
  }
}

export const db = new Dexie();
