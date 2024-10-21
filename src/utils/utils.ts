import { IncomingMessage, ServerResponse } from 'node:http';
import { ErrorMessage, StatusCode } from '../common/enums';

export const sendNotSupported = (req: IncomingMessage, res: ServerResponse) => {
  res.statusCode = StatusCode.NOT_FOUND;
  res.setHeader('Content-Type', 'application/json');
  res.write(JSON.stringify({ message: `${req.method} with path ${req.url} not supported` }));
  res.end();
};

export const sendResponse = (res: ServerResponse, statusCode: StatusCode, data: unknown) => {
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.write(JSON.stringify(data));
  res.end();
};

export const extractUserIdFromUrl = (url?: string) => url?.split('/')[3] || null;

export const parseRequestBody = <T>(req: IncomingMessage): Promise<T> =>
  new Promise((res, rej) => {
    let body = '';

    req.on('data', (chunk) => {
      body += chunk;
    });

    req.on('end', () => {
      try {
        res(JSON.parse(body));
      } catch (error) {
        rej(error);
      }
    });
  });

export const isUserFieldsValid = (username: string, age: number, hobbies: string[], res: ServerResponse) => {
  if (!username || !age || !hobbies) {
    sendResponse(res, StatusCode.BAD_REQUEST, {
      message: ErrorMessage.MissingUserFields,
    });

    return false;
  }

  if (typeof username !== 'string' || !username.trim()) {
    sendResponse(res, StatusCode.BAD_REQUEST, {
      message: ErrorMessage.InvalidUsername,
    });

    return false;
  }

  if (typeof age !== 'number') {
    sendResponse(res, StatusCode.BAD_REQUEST, {
      message: ErrorMessage.InvalidAge,
    });

    return false;
  }

  if (!Array.isArray(hobbies) || !hobbies.every((hobby) => typeof hobby === 'string')) {
    sendResponse(res, StatusCode.BAD_REQUEST, {
      message: ErrorMessage.InvalidHobbies,
    });

    return false;
  }

  return true;
};
