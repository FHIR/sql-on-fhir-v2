import { startServer } from './server.js';

const config = {    
  port: 3000,
};

startServer(config).catch(console.error);