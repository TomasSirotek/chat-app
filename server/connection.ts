const Pool = require("pg").Pool;
require("dotenv").config(); // use .env file

const pgConfig = {
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: 5432,
};

const pgPool = new Pool(pgConfig);

const pgPoolWrapper = {
  async connect() {
    for (let nRetry = 1; ; nRetry++) {
      try {
        const client = await pgPool.connect();
        if (nRetry > 1) {
          console.info("Now successfully connected to Postgres");
        }
        return client;
      } catch (e: any) {
        if (e.toString().includes("ECONNREFUSED") && nRetry < 5) {
          console.info(
            "ECONNREFUSED connecting to Postgres, " +
              "maybe container is not ready yet, will retry " +
              nRetry,
          );
          // Wait 1 second
          await new Promise((resolve) => setTimeout(resolve, 1000));
        } else {
          throw e;
        }
      }
    }
  },
};

module.exports = pgPoolWrapper;
