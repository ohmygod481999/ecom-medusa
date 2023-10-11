const dotenv = require('dotenv');

let ENV_FILE_NAME = '';
switch (process.env.NODE_ENV) {
  case 'production':
    ENV_FILE_NAME = '.env.production';
    break;
  case 'staging':
    ENV_FILE_NAME = '.env.staging';
    break;
  case 'test':
    ENV_FILE_NAME = '.env.test';
    break;
  case 'development':
  default:
    ENV_FILE_NAME = '.env';
    break;
}

try {
  dotenv.config({path: process.cwd() + '/' + ENV_FILE_NAME});
} catch (e) {}

// CORS when consuming Medusa from admin
// const ADMIN_CORS =
//   process.env.ADMIN_CORS || 'http://localhost:7000,http://localhost:7001';

console.log(process.env.ADMIN_CORS)
const ADMIN_CORS =
  process.env.ADMIN_CORS || 'http://longvb.ddns.net:7000';

// CORS to avoid issues when consuming Medusa from a client
const STORE_CORS =
  process.env.STORE_CORS || 'http://localhost:8000,http://longvb.ddns.net:8001';

const DATABASE_TYPE = process.env.DATABASE_TYPE || 'sqlite';
const DATABASE_URL =
  process.env.DATABASE_URL || 'postgres://localhost/medusa-store';
const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

console.log(process.env.SENDGRID_API_KEY);

const plugins = [
  `medusa-fulfillment-manual`,
  `medusa-payment-manual`,
  // To enable the admin plugin, uncomment the following lines and run `yarn add @medusajs/admin`
  {
    // resolve: 'admin-longvb',
    resolve: '@medusajs/admin',
    /** @type {import('@medusajs/admin').PluginOptions} */
    options: {
      autoRebuild: true,
      path: "/app",
      // ecomBackend: 'http://asdasd.asd',
      // base: '/admin',
    },
  },
  {
    resolve: `medusa-plugin-sendgrid`,
    options: {
      api_key: process.env.SENDGRID_API_KEY,
      from: process.env.SENDGRID_FROM,
      order_placed_template: process.env.SENDGRID_ORDER_PLACED_ID,
    },
  },
  {
    resolve: `@medusajs/file-local`,
    options: {
      // optional
    },
  }
];

const modules = {
  /*eventBus: {
    resolve: "@medusajs/event-bus-redis",
    options: {
      redisUrl: REDIS_URL
    }
  },
  cacheService: {
    resolve: "@medusajs/cache-redis",
    options: {
      redisUrl: REDIS_URL
    }
  },*/
};

/** @type {import('@medusajs/medusa').ConfigModule["projectConfig"]} */
const projectConfig = {
  jwtSecret: process.env.JWT_SECRET,
  cookieSecret: process.env.COOKIE_SECRET,
  database_database: './medusa-db.sql',
  database_type: DATABASE_TYPE,
  store_cors: STORE_CORS,
  admin_cors: ADMIN_CORS,
  // Uncomment the following lines to enable REDIS
  redis_url: REDIS_URL
};

console.log(projectConfig)

if (DATABASE_URL && DATABASE_TYPE === 'postgres') {
  projectConfig.database_url = DATABASE_URL;
  delete projectConfig['database_database'];
}

/** @type {import('@medusajs/medusa').ConfigModule} */
module.exports = {
  projectConfig,
  plugins,
  modules,
};
