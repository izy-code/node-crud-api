import http, { IncomingMessage, RequestOptions, ServerResponse } from 'node:http';
import { availableParallelism } from 'node:os';
import { ErrorMessage, StatusCode } from '../common/enums';
import { sendResponse } from '../utils/utils';
import { primaryServerPort } from './init-servers';

let currentWorkerNumber = 1;

export const delegateToWorker = (reqFromPrimary: IncomingMessage, resToPrimary: ServerResponse) => {
  const workerServerPort = primaryServerPort + currentWorkerNumber;

  console.log(
    `Request forwarded to http://localhost:${workerServerPort}${reqFromPrimary.url}. Worker ${currentWorkerNumber} is processing...`,
  );

  const options: RequestOptions = {
    hostname: 'localhost',
    port: workerServerPort,
    method: reqFromPrimary.method,
    path: reqFromPrimary.url,
    headers: reqFromPrimary.headers,
  };

  const reqToWorker = http.request(options, (resFromWorker) => {
    resToPrimary.writeHead(resFromWorker.statusCode || StatusCode.INTERNAL_SERVER_ERROR, resFromWorker.headers);
    resFromWorker.pipe(resToPrimary);
  });

  reqToWorker.on('error', (err) => {
    sendResponse(resToPrimary, StatusCode.INTERNAL_SERVER_ERROR, {
      message: `${ErrorMessage.InternalServerError}: ${(err as Error).message}`,
    });
  });

  if (reqFromPrimary.method === 'POST' || reqFromPrimary.method === 'PUT') {
    reqFromPrimary.pipe(reqToWorker);
  } else {
    reqToWorker.end();
  }

  currentWorkerNumber = (currentWorkerNumber % (availableParallelism() - 1)) + 1;
};
