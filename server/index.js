require('dotenv').config();

const app = require('./src/app');
const connectDatabase = require('./src/config/database');

const port = Number(process.env.PORT) || 5000;

async function start() {
  if (!process.env.MONGO_URI || !process.env.JWT_SECRET) {
    throw new Error('MONGO_URI and JWT_SECRET must be configured.');
  }

  await connectDatabase();
  app.listen(port, () => console.log(`API listening on port ${port}`));
}

start().catch((error) => {
  console.error('API startup failed:', error.message);
  process.exit(1);
});
