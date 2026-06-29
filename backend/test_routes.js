const { MongoMemoryServer } = require('mongodb-memory-server');
const fs = require('fs');
const { spawn } = require('child_process');
const axios = require('axios');
const path = require('path');

async function runTests() {
  console.log('Starting MongoMemoryServer...');
  const mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();

  // Update .env
  const envPath = path.join(__dirname, '.env');
  fs.writeFileSync(envPath, `PORT=5000\nMONGO_URI=${uri}\nJWT_SECRET=mysecret`);

  console.log('Starting server with Mongo URI:', uri);
  const server = spawn('node', ['server.js'], { cwd: __dirname });

  server.stdout.on('data', data => console.log(`Server: ${data}`));
  server.stderr.on('data', data => console.error(`Server Error: ${data}`));

  // Wait for server to start
  await new Promise(r => setTimeout(r, 3000));
  console.log('Finished waiting for server start.');

  let hasErrors = false;

  try {
    const api = axios.create({ baseURL: 'http://localhost:5000' });
    let token;
    let itemId;

    console.log('\n--- 1. Testing Registration ---');
    const registerRes = await api.post('/api/auth/register', {
      name: 'Test User', email: 'test@example.com', password: 'password123'
    });
    console.log('Register Success:', registerRes.status === 201);
    
    console.log('\n--- 2. Testing Login ---');
    const loginRes = await api.post('/api/auth/login', {
      email: 'test@example.com', password: 'password123'
    });
    console.log('Login Success:', loginRes.status === 200);
    token = loginRes.data.token;
    console.log('Got Token:', !!token);

    console.log('\n--- 3. Testing Create Item ---');
    const createRes = await api.post('/api/items', {
      title: 'Lost Wallet', description: 'Black leather wallet', category: 'Wallet/Bag',
      type: 'lost', location: 'Library', date: new Date().toISOString()
    }, { headers: { Authorization: `Bearer ${token}` } });
    console.log('Create Item Success:', createRes.status === 201);
    itemId = createRes.data._id;
    console.log('Item ID:', itemId);

    console.log('\n--- 4. Testing Get Items ---');
    const getRes = await api.get('/api/items');
    console.log('Get Items Success:', getRes.status === 200 && getRes.data.length > 0);
    
    console.log('\n--- 5. Testing Get My Items ---');
    const getMyRes = await api.get('/api/items/my', { headers: { Authorization: `Bearer ${token}` } });
    console.log('Get My Items Success:', getMyRes.status === 200 && getMyRes.data.length === 1);

    console.log('\n--- 6. Testing Update Item ---');
    const updateRes = await api.put(`/api/items/${itemId}`, { status: 'recovered' }, { headers: { Authorization: `Bearer ${token}` } });
    console.log('Update Item Success:', updateRes.status === 200 && updateRes.data.status === 'recovered');

    console.log('\n--- 7. Testing Delete Item ---');
    const deleteRes = await api.delete(`/api/items/${itemId}`, { headers: { Authorization: `Bearer ${token}` } });
    console.log('Delete Item Success:', deleteRes.status === 200);

  } catch (err) {
    console.error('\nTest Failed!');
    console.error('Error info:', err.response ? err.response.data : (err.cause || err.message));
    hasErrors = true;
  } finally {
    server.kill();
    await mongod.stop();
    if (hasErrors) {
      process.exit(1);
    } else {
      console.log('\nAll tests completed successfully.');
      process.exit(0);
    }
  }
}

runTests();
