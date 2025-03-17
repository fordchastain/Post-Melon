import logger from '../services/log-service.js';
import { initializeDatabase } from './database.js';

export const runMigrations = async (): Promise<void> => {
  const db = initializeDatabase();

  const migrations: { name: string; query: string }[] = [
    {
      name: 'request',
      query: `
        CREATE TABLE IF NOT EXISTS request (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT,
          method TEXT NOT NULL,
          protocol TEXT NOT NULL DEFAULT 'http',
          url TEXT NOT NULL,
          headers TEXT NOT NULL,
          body TEXT,
          graphql_query TEXT,
          websocket_event TEXT,
          grpc_method TEXT,
          encrypted BOOLEAN NOT NULL DEFAULT 0,
          response_status INTEGER,
          response_body TEXT,
          response_headers TEXT NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `,
    },
    {
      name: 'template',
      query: `
        CREATE TABLE IF NOT EXISTS template (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL UNIQUE,
          method TEXT NOT NULL,
          protocol TEXT NOT NULL DEFAULT 'http',
          url TEXT NOT NULL,
          headers TEXT NOT NULL,
          body TEXT,
          graphql_query TEXT,
          websocket_event TEXT,
          grpc_method TEXT,
          encrypted BOOLEAN NOT NULL DEFAULT 0,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `,
    },
  ];

  return new Promise((resolve, reject) => {
    db.serialize(() => {
      let hasError = false;

      migrations.forEach(({ name, query }, index) => {
        db.run(query, (err) => {
          if (err) {
            logger.error(`❌ Error creating "${name}" table:`, err);
            hasError = true;
            reject(err);
            return;
          }

          logger.info(`✅ "${name}" table created.`);

          if (index === migrations.length - 1 && !hasError) {
            logger.info('✅ All migrations applied successfully.');
            resolve();
          }
        });
      });
    });
  });
};
