import request from 'supertest';
import { server, shutdown } from '..';
import { API_PATH } from '../common/constants';
import { ErrorMessage, StatusCode } from '../common/enums';
import { mockedUsers } from './setup/mocks';

const invalidId = 'invalidUserId';
const nonExistentValidId = mockedUsers[3].id;

const newUser = {
  username: mockedUsers[0].username,
  age: mockedUsers[0].age,
  hobbies: mockedUsers[0].hobbies,
};
const updatedUser = {
  username: mockedUsers[1].username,
  age: mockedUsers[1].age,
  hobbies: mockedUsers[1].hobbies,
};

describe('Error handling scenario', () => {
  afterAll(() => {
    shutdown();
  });

  it('should return an error for invalid UUIDv4 on GET /api/users/{invalidId}', async () => {
    await request(server).post(API_PATH).send(newUser);
    const response = await request(server).get(`${API_PATH}/${invalidId}`);

    expect(response.status).toBe(StatusCode.BAD_REQUEST);
    expect(response.body.message).toEqual(`${ErrorMessage.InvalidUserId}: ${invalidId}`);
  });

  it('should indicate user not found for an undefined user on GET /api/users/{nonExistentValidId}', async () => {
    await request(server).post(API_PATH).send(newUser);
    const response = await request(server).get(`${API_PATH}/${nonExistentValidId}`);

    expect(response.status).toBe(StatusCode.NOT_FOUND);
    expect(response.body.message).toEqual(`User with id ${nonExistentValidId} not found`);
  });

  it('should indicate user not found for an undefined user on PUT /api/users/{nonExistentValidId}', async () => {
    await request(server).post(API_PATH).send(newUser);
    const response = await request(server).put(`${API_PATH}/${nonExistentValidId}`).send(updatedUser);

    expect(response.status).toBe(StatusCode.NOT_FOUND);
    expect(response.body.message).toEqual(`User with id ${nonExistentValidId} not found`);
  });

  it('should return an error for invalid UUIDv4 on PUT /api/users/{invalidId}', async () => {
    await request(server).post(API_PATH).send(newUser);
    const response = await request(server).put(`${API_PATH}/${invalidId}`).send(updatedUser);

    expect(response.status).toBe(StatusCode.BAD_REQUEST);
    expect(response.body.message).toEqual(`${ErrorMessage.InvalidUserId}: ${invalidId}`);
  });

  it('should indicate user not found for an undefined user on DELETE /api/users/{nonExistentValidId}', async () => {
    await request(server).post(API_PATH).send(newUser);
    const response = await request(server).delete(`${API_PATH}/${nonExistentValidId}`);

    expect(response.status).toBe(StatusCode.NOT_FOUND);
    expect(response.body.message).toEqual(`User with id ${nonExistentValidId} not found`);
  });

  it('should return an error for invalid UUIDv4 on DELETE /api/users/{invalidId}', async () => {
    await request(server).post(API_PATH).send(newUser);
    const response = await request(server).delete(`${API_PATH}/${invalidId}`);

    expect(response.status).toBe(StatusCode.BAD_REQUEST);
    expect(response.body.message).toEqual(`${ErrorMessage.InvalidUserId}: ${invalidId}`);
  });

  it('should return an error for GET /non-existing-path', async () => {
    const response = await request(server).get('/non-existing-path');

    expect(response.status).toBe(StatusCode.NOT_FOUND);
    expect(response.body).toEqual({ message: 'GET with path /non-existing-path not supported' });
  });
});
