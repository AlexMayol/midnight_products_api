const config = require("../config");

const { Pool, Client } = require('pg')
const connectionString = config.database;


const client = new Client({
  connectionString: connectionString,
})

client.connect()  

module.exports = client;