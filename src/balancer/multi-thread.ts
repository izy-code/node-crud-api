import cluster from 'node:cluster';
import { availableParallelism } from 'node:os';
import { dbServerPort } from '../database/db-server';
import { initServers } from './init-servers';

const parallelismCount = availableParallelism();
const workerNumberFromId: { [workerId: number]: number } = {};

if (!process.env.MULTI) {
  console.log('Environment variable "MULTI" not set');
  process.exit(1);
}

if (cluster.isPrimary) {
  console.log(`Primary process ${process.pid} is running`);

  for (let i = 1; i < parallelismCount; i++) {
    const worker = cluster.fork({ WORKER_NUMBER: i, DB_PORT: dbServerPort });

    workerNumberFromId[worker.id] = i;
  }

  cluster.on('exit', (worker) => {
    const workerNumber = workerNumberFromId[worker.id];

    console.log(`Worker ${workerNumber} exited. Restarting this worker...`);
    delete workerNumberFromId[worker.id];

    const newWorker = cluster.fork({ WORKER_NUMBER: workerNumber, DB_PORT: dbServerPort });

    workerNumberFromId[newWorker.id] = workerNumber;
  });

  initServers();
} else {
  initServers(Number(process.env.WORKER_NUMBER));
}
