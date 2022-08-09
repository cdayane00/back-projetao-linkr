import "../../config/config.js";
import pg from "pg";

const { Pool } = pg;

const configDatabase = {
  connectionString: process.env.DATABASE_URL,
};

if (process.env.NODE_ENV === "prod") {
  configDatabase.ssl = {
    rejectUnauthorized: false,
  };
}

export const connection = new Pool(configDatabase);
