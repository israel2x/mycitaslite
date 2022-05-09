const env = process.env;

const config = {
  db: env.citas_db,
  jwtPrivateKey: env.jwtPrivateKey || 7896,
};

module.exports = config;
