export enum StatusCode {
  OK = 200,
  CREATED = 201,
  DELETED = 204,
  BAD_REQUEST = 400,
  NOT_FOUND = 404,
  METHOD_NOT_ALLOWED = 405,
  INTERNAL_SERVER_ERROR = 500,
}

export enum ErrorMessage {
  InternalServerError = 'Internal Server Error',
  MissingUserId = 'No user ID provided in request URL',
  InvalidUserId = 'Invalid user ID (non-UUID) provided in request URL',
  MissingUserFields = 'Missing user fields (required: username, age, hobbies)',
  InvalidUsername = 'Invalid username type (string expected)',
  InvalidAge = 'Invalid age type (number expected)',
  InvalidHobbies = 'Invalid hobbies type (array of strings expected)',
  InvalidRequestBody = 'Invalid request body',
  DbMethodNotAllowed = 'Method not allowed, use POST for DB operations',
}
