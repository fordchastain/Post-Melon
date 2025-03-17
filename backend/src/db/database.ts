import sqlite3 from 'sqlite3';
import path from 'path';
import { Database } from 'sqlite3';
import { fileURLToPath } from 'url';
import logger from '../services/log-service.js';

let databaseInstance: Database | null = null;

export const initializeDatabase = (): Database => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  if (!databaseInstance) {
    databaseInstance = new sqlite3.Database(path.join(__dirname, 'postmelon.db'), (err) => {
      if (err) {
        logger.error('Error connecting to SQLite:', err);
      } else {
        logger.info('Connected to SQLite database.');
      }
    });
  }
  return databaseInstance;
};
