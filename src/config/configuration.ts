export default () => ({
  host: {
    url: process.env.HOST_URL,
    port: parseInt(process.env.HOST_PORT, 10) || parseInt(process.env.PORT, 10),
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expiration: parseInt(process.env.JWT_EXPIRATION),
  },

  web: {
    url: process.env.WEB_URL,
    port: parseInt(process.env.WEB_PORT, 10) || 8080,
  },

  db: {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
  },

  mail: {
    host: process.env.MAIL_HOST,
    port: parseInt(process.env.MAIL_PORT, 10),
    secure: process.env.MAIL_SECURE,
    username: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});
