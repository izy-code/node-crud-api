import { IncomingMessage, ServerResponse } from 'node:http';
import { ErrorMessage, StatusCode } from '../common/enums';
import { sendNotSupported, sendResponse } from '../utils/utils';
import { handleDeleteRequest, handleGetRequest, handlePostRequest, handlePutRequest } from './request-handlers';

export const requestListener = async (req: IncomingMessage, res: ServerResponse) => {
  try {
    switch (req.method) {
      case 'GET':
        await handleGetRequest(req, res);
        break;

      case 'POST':
        await handlePostRequest(req, res);
        break;

      case 'PUT':
        await handlePutRequest(req, res);
        break;

      case 'DELETE':
        await handleDeleteRequest(req, res);
        break;

      default:
        sendNotSupported(req, res);
    }
  } catch (err) {
    sendResponse(res, StatusCode.INTERNAL_SERVER_ERROR, {
      message: `${ErrorMessage.InternalServerError}: ${(err as Error).message}`,
    });
  }
};
