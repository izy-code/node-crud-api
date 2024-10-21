import cluster from 'node:cluster';
import { IncomingMessage, ServerResponse } from 'node:http';
import { createUser, deleteUser, getUser, getUsers, updateUser } from '../action-manager/user-manager';
import { delegateToWorker } from '../balancer/delegate-to-worker';
import { API_PATH } from '../common/constants';
import { sendNotSupported } from '../utils/utils';

export const handleGetRequest = async (req: IncomingMessage, res: ServerResponse) => {
  if (cluster.isPrimary && process.env.MULTI) {
    delegateToWorker(req, res);
  } else if (req.url === API_PATH) {
    await getUsers(req, res);
  } else if (req.url?.startsWith(`${API_PATH}/`)) {
    await getUser(req, res);
  } else {
    sendNotSupported(req, res);
  }
};

export const handlePostRequest = async (req: IncomingMessage, res: ServerResponse) => {
  if (cluster.isPrimary && process.env.MULTI) {
    delegateToWorker(req, res);
  } else if (req.url === API_PATH) {
    await createUser(req, res);
  } else {
    sendNotSupported(req, res);
  }
};

export const handlePutRequest = async (req: IncomingMessage, res: ServerResponse) => {
  if (cluster.isPrimary && process.env.MULTI) {
    delegateToWorker(req, res);
  } else if (req.url?.startsWith(`${API_PATH}/`)) {
    await updateUser(req, res);
  } else {
    sendNotSupported(req, res);
  }
};

export const handleDeleteRequest = async (req: IncomingMessage, res: ServerResponse) => {
  if (cluster.isPrimary && process.env.MULTI) {
    delegateToWorker(req, res);
  } else if (req.url?.startsWith(`${API_PATH}/`)) {
    await deleteUser(req, res);
  } else {
    sendNotSupported(req, res);
  }
};
