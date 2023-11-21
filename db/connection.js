const { Pool } = require('pg');
const ENV = process.env.NODE_ENV || 'development';

require('dotenv').config({
  path: `${__dirname}/../.env.${ENV}`,
});
const PGDATABASE = process.env.PGDATABASE;
if (!process.env.PGDATABASE) {
  throw new Error('PGDATABASE not set');
}

console.log(`ENV>>>>>>>>>${ENV}`)
console.log(`PGDATABASE>>>>>>>>>${PGDATABASE}`)

module.exports = new Pool();
