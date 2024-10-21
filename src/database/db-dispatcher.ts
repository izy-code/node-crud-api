import cluster from 'node:cluster';
import http from 'node:http';
import { v4 as uuid } from 'uuid';
import { DbCommands, StatusCode } from '../common/enums';
import { User } from '../common/types';
import { dbServerPort } from './db-server';

const handleDbRequest = (data: unknown) => {
  return new Promise((resolve, reject) => {
    const options: http.RequestOptions = {
      hostname: 'localhost',
      port: cluster.isWorker ? process.env.DB_PORT : dbServerPort,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const req = http.request(options, (res) => {
      let body = '';

      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => {
        if (res.statusCode !== StatusCode.OK) {
          resolve({ status: res.statusCode, message: body });
        } else {
          resolve(JSON.parse(body));
        }
      });
    });

    req.on('error', () => reject());
    req.write(JSON.stringify(data));
    req.end();
  });
};

export const receiveAllUsers = async () => await handleDbRequest({ command: DbCommands.GET_USERS });

export const receiveUserById = async (userId: User['id']) =>
  await handleDbRequest({ command: DbCommands.GET_USER, userId });

export const receiveCreatedUser = async (newUser: Omit<User, 'id'>) => {
  const userWithId = {
    id: uuid(),
    ...newUser,
  };

  return await handleDbRequest({ command: DbCommands.CREATE_USER, data: userWithId });
};

export const receiveUpdatedUser = async (userId: User['id'], changes: Partial<Omit<User, 'id'>>) =>
  await handleDbRequest({ command: DbCommands.UPDATE_USER, userId, data: changes });

export const receiveDeletedUser = async (userId: User['id']) =>
  await handleDbRequest({ command: DbCommands.DELETE_USER, userId });
