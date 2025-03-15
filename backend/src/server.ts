import express from 'express';
import cors from 'cors';
import { runMigrations } from './db/migration.js';
import { requestRoutes } from './routes/request-routes.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api', requestRoutes);

runMigrations()
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('Server startup failed due to migration error:', err.message);
    process.exit(1);
  });
