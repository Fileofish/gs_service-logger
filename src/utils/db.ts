import Database from 'better-sqlite3';

const DATABASE_PATH = process.env.DATABASE_PATH || './logs/logger.db';
const db = new Database(DATABASE_PATH, { verbose: console.log });

db.loadExtension('/usr/lib/sqlite3/extensions/uuid.so');

export default db;