import "../../config/config.js";
import pg from "pg";

const { Pool } = pg;

const configDatabase = {
  connectionString: process.env.DATABASE_URL,
  // user: process.env.PGUSER,
  // host: process.env.PGHOST,
  // port: process.env.PGPORT,
  // database: process.env.PGDATABASE,
  // password: process.env.PGPASSWORD,
};

if (process.env.NODE_ENV === "prod") {
  configDatabase.ssl = {
    rejectUnauthorized: false,
  };
}

export const connection = new Pool(configDatabase);
