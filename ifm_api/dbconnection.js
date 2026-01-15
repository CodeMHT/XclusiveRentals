import pkg from "pg";
import dotenv from 'dotenv';
dotenv.config()

const { Client } = pkg
const client = new Client({
    connectionString: process.env.DB_URL

})

export default client;