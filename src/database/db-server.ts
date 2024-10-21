import 'dotenv/config';
import { createServer, IncomingMessage, ServerResponse } from 'node:http';
import { availableParallelism } from 'node:os';
import { DEFAULT_PORT } from '../common/constants';
import { DbCommands, ErrorMessage, StatusCode } from '../common/enums';
import { User } from '../common/types';
import { parseRequestBody, sendResponse } from '../utils/utils';
import { createUser, deleteUser, getUser, getUsers, updateUser } from './db-operations';

export const users: User[] = [];

const requestHandler = async (req: IncomingMessage, res: ServerResponse) => {
  if (req.method !== 'POST') {
    sendResponse(res, StatusCode.METHOD_NOT_ALLOWED, ErrorMessage.DbMethodNotAllowed);
    return;
  }

  try {
    const requestBody = await parseRequestBody<{ command: string; userId: string; data: Partial<User> }>(req);
    const { command, userId, data } = requestBody;

    switch (command) {
      case DbCommands.GET_USERS:
        sendResponse(res, StatusCode.OK, getUsers());
        break;

      case DbCommands.GET_USER:
        sendResponse(res, StatusCode.OK, getUser(userId));
        break;

      case DbCommands.CREATE_USER:
        sendResponse(res, StatusCode.OK, createUser(data as User));
        break;

      case DbCommands.UPDATE_USER:
        sendResponse(res, StatusCode.OK, updateUser(userId, data));
        break;

      case DbCommands.DELETE_USER:
        sendResponse(res, StatusCode.OK, deleteUser(userId));
        break;

      default:
        sendResponse(res, StatusCode.BAD_REQUEST, ErrorMessage.InvalidRequestBody);
    }
  } catch {
    sendResponse(res, StatusCode.INTERNAL_SERVER_ERROR, ErrorMessage.InternalServerError);
  }
};

export const dbServerPort = (Number(process.env.PORT) || DEFAULT_PORT) + availableParallelism();

export const startDbServer = () => {
  const server = createServer(requestHandler);

  server.listen(dbServerPort, () => {
    if (process.env.NODE_ENV !== 'test') {
      console.log(`DB server listening at http://localhost:${dbServerPort}/`);
    }
  });

  return server;
};
