const axios = require('axios');

const BASE = process.env.BASE_URL || 'http://localhost:3000';

async function run() {
  try {
    console.log('Creating employee...');
    const create = await axios.post(`${BASE}/employees`, {
      name: 'João Silva',
      pixKey: 'joao@example.com',
      wallet: '0x1234567890abcdef1234567890abcdef12345678',
      network: 'sepolia'
    });
    console.log('Created:', create.data);

    console.log('Listing employees...');
    const list = await axios.get(`${BASE}/employees`);
    console.log('Employees:', list.data);

    const id = create.data.id;
    console.log(`Fetching employee ${id}...`);
    const single = await axios.get(`${BASE}/employees/${id}`);
    console.log('Employee:', single.data);

    console.log('Updating employee (name -> João Atualizado)...');
    const updated = await axios.put(`${BASE}/employees/${id}`, { name: 'João Atualizado' });
    console.log('Updated:', updated.data);

    console.log('Deleting employee...');
    await axios.delete(`${BASE}/employees/${id}`);
    console.log('Deleted. Final list:');
    const final = await axios.get(`${BASE}/employees`);
    console.log(final.data);
  } catch (err) {
    console.error('Error:', err.response ? err.response.data : err.message);
    process.exitCode = 1;
  }
}

if (require.main === module) run();

module.exports = { run };
