import 'dotenv/config';
import http from 'node:http';
import { DEFAULT_PORT } from '../common/constants';
import { startDbServer } from '../database/db-server';
import { requestListener } from '../request-listener/request-listener';

export const primaryServerPort = Number(process.env.PORT) || DEFAULT_PORT;

export const initServers = (workerNumber?: number) => {
  const server = http.createServer((request, response) => {
    requestListener(request, response);
  });

  if (workerNumber) {
    const workerServerPort = primaryServerPort + workerNumber;

    server.listen(workerServerPort, () => {
      console.log(
        `Worker ${workerNumber} with PID ${process.pid} is running. Server listening at http://localhost:${workerServerPort}/`,
      );
    });
  } else {
    server.listen(primaryServerPort, () => {
      console.log(`Load balancer server listening at http://localhost:${primaryServerPort}/`);
    });

    startDbServer();
  }
};
