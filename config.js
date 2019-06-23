require("dotenv").config();

module.exports = {
  database: process.env.POSTGRES_URL
};

