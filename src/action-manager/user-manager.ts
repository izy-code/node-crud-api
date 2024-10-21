import { IncomingMessage, ServerResponse } from 'node:http';
import { validate } from 'uuid';
import { ErrorMessage, StatusCode } from '../common/enums';
import { User } from '../common/types';
import {
  receiveAllUsers,
  receiveCreatedUser,
  receiveDeletedUser,
  receiveUpdatedUser,
  receiveUserById,
} from '../database/db-dispatcher';
import { extractUserIdFromUrl, isUserFieldsValid, parseRequestBody, sendResponse } from '../utils/utils';

const handleDbResponse = async (
  req: IncomingMessage,
  res: ServerResponse,
  dbResponsePromise: Promise<unknown>,
  successStatus: StatusCode = StatusCode.OK,
) => {
  try {
    const result = await dbResponsePromise;

    if (result && typeof result === 'object' && 'status' in result && 'message' in result) {
      sendResponse(res, result.status as StatusCode, { message: result.message });
    } else if (result) {
      sendResponse(res, successStatus, result);
    } else {
      sendResponse(res, StatusCode.NOT_FOUND, {
        message: `User with id ${extractUserIdFromUrl(req.url)} not found`,
      });
    }
  } catch {
    sendResponse(res, StatusCode.INTERNAL_SERVER_ERROR, { message: 'Internal Server Error' });
  }
};

export const getUsers = async (req: IncomingMessage, res: ServerResponse) => {
  await handleDbResponse(req, res, receiveAllUsers());
};

export const getUser = async (req: IncomingMessage, res: ServerResponse) => {
  const userId = extractUserIdFromUrl(req.url);

  if (!userId) {
    sendResponse(res, StatusCode.BAD_REQUEST, { message: ErrorMessage.MissingUserId });
    return;
  }

  if (!validate(userId)) {
    sendResponse(res, StatusCode.BAD_REQUEST, { message: `${ErrorMessage.InvalidUserId}: ${userId}` });
    return;
  }

  await handleDbResponse(req, res, receiveUserById(userId));
};

export const createUser = async (req: IncomingMessage, res: ServerResponse) => {
  try {
    const parsedRequestBody = await parseRequestBody<User>(req);
    const { username, age, hobbies } = parsedRequestBody;

    if (!isUserFieldsValid(username, age, hobbies, res)) {
      return;
    }

    const createdUser: Omit<User, 'id'> = { username, age, hobbies };

    await handleDbResponse(req, res, receiveCreatedUser(createdUser), StatusCode.CREATED);
  } catch {
    sendResponse(res, StatusCode.BAD_REQUEST, { message: ErrorMessage.InvalidRequestBody });
  }
};

export const updateUser = async (req: IncomingMessage, res: ServerResponse) => {
  try {
    const userId = extractUserIdFromUrl(req.url);

    if (!userId) {
      sendResponse(res, StatusCode.BAD_REQUEST, { message: ErrorMessage.MissingUserId });
      return;
    }

    if (!validate(userId)) {
      sendResponse(res, StatusCode.BAD_REQUEST, { message: `${ErrorMessage.InvalidUserId}: ${userId}` });
      return;
    }

    const parsedRequestBody = await parseRequestBody<User>(req);
    const { username, age, hobbies } = parsedRequestBody;

    if (!isUserFieldsValid(username, age, hobbies, res)) {
      return;
    }

    const updatedFields: Omit<User, 'id'> = { username, age, hobbies };

    await handleDbResponse(req, res, receiveUpdatedUser(userId, updatedFields));
  } catch {
    sendResponse(res, StatusCode.BAD_REQUEST, { message: ErrorMessage.InvalidRequestBody });
  }
};

export const deleteUser = async (req: IncomingMessage, res: ServerResponse) => {
  const userId = extractUserIdFromUrl(req.url);

  if (!userId) {
    sendResponse(res, StatusCode.BAD_REQUEST, { message: ErrorMessage.MissingUserId });
    return;
  }

  if (!validate(userId)) {
    sendResponse(res, StatusCode.BAD_REQUEST, { message: `${ErrorMessage.InvalidUserId}: ${userId}` });
    return;
  }

  await handleDbResponse(req, res, receiveDeletedUser(userId), StatusCode.DELETED);
};
