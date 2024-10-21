import request from 'supertest';
import { server, shutdown } from '..';
import { API_PATH } from '../common/constants';
import { StatusCode } from '../common/enums';
import { mockedUsers } from './setup/mocks';

describe('Scenario from requirements', () => {
  afterAll(() => {
    shutdown();
  });

  it('should respond with an empty array for GET /api/users if no records exist', async () => {
    const response = await request(server).get(API_PATH);

    expect(response.status).toBe(StatusCode.OK);
    expect(response.body).toEqual([]);
  });

  it('should create a new user with POST /api/users and return the created record', async () => {
    const newUser = {
      username: mockedUsers[0].username,
      age: mockedUsers[0].age,
      hobbies: mockedUsers[0].hobbies,
    };

    const response = await request(server).post(API_PATH).send(newUser);

    mockedUsers[0].id = response.body.id;

    expect(response.status).toBe(StatusCode.CREATED);
    expect(response.body).toMatchObject(newUser);
  });

  it('should retrieve the created user with GET /api/users/{userId}', async () => {
    const userId = mockedUsers[0].id;
    const response = await request(server).get(`${API_PATH}/${userId}`);

    expect(response.status).toBe(StatusCode.OK);
    expect(response.body).toEqual(mockedUsers[0]);
  });

  it('should update the created user with PUT /api/users/{userId} and return the updated record', async () => {
    const updatedUser = {
      username: mockedUsers[1].username,
      age: mockedUsers[1].age,
      hobbies: mockedUsers[1].hobbies,
    };

    const response = await request(server).put(`${API_PATH}/${mockedUsers[0].id}`).send(updatedUser);

    expect(response.status).toBe(StatusCode.OK);
    expect(response.body).toMatchObject(updatedUser);
    expect(response.body.id).toBe(mockedUsers[0].id);
  });

  it('should delete the created user with DELETE /api/users/{userId} and confirm deletion', async () => {
    const response = await request(server).delete(`${API_PATH}/${mockedUsers[0].id}`);

    expect(response.status).toBe(StatusCode.DELETED);
  });

  it('should respond with 404 for GET /api/users/{userId} after deletion', async () => {
    const response = await request(server).get(`${API_PATH}/${mockedUsers[0].id}`);

    expect(response.status).toBe(StatusCode.NOT_FOUND);
    expect(response.body.message).toBe(`User with id ${mockedUsers[0].id} not found`);
  });
});
