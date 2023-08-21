const { MongoClient } = require('mongodb');
const dotenv = require('dotenv')
dotenv.config()

const mongoURI = process.env.MONGOURL
const dbName = process.env.dbName;

async function connectDB() {
  const client = new MongoClient(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

  try {
    await client.connect();
    console.log('Connected to the database');
    return client.db(dbName);
  } catch (error) {
    console.error('Error connecting to the database:', error);
    throw error;
  }
}

module.exports = connectDB;
