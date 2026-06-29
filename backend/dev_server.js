const { MongoMemoryServer } = require('mongodb-memory-server');

async function start() {
  console.log('Starting In-Memory MongoDB for local testing...');
  const mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  
  console.log(`In-Memory MongoDB started at: ${uri}`);
  process.env.MONGO_URI = uri;
  process.env.PORT = 5000;
  process.env.JWT_SECRET = 'my_super_secret_jwt_key';
  
  console.log('Starting Express Server...');
  require('./server.js');
}

start().catch(console.error);
