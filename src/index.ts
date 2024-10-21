import 'dotenv/config';
import http from 'node:http';
import { DEFAULT_PORT } from './common/constants';
import { startDbServer } from './database/db-server';
import { requestListener } from './request-listener/request-listener';

export const server = http.createServer(requestListener);

const port = Number(process.env.PORT) || DEFAULT_PORT;

if (process.env.NODE_ENV !== 'test') {
  server.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}/`);
  });
}

const dbServer = startDbServer();

export const shutdown = () => {
  server.close();
  dbServer.close();
};
