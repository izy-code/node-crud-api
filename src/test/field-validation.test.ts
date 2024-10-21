import request from 'supertest';
import { server, shutdown } from '..';
import { API_PATH } from '../common/constants';
import { ErrorMessage, StatusCode } from '../common/enums';
import { mockedUsers } from './setup/mocks';

describe('Fields validation scenario', () => {
  afterAll(() => {
    shutdown();
  });

  describe('POST /api/users', () => {
    it('should return an error for missing username field', async () => {
      const userWithoutUsername = {
        age: 56,
        hobbies: ['tennis', 'tourism'],
      };
      const response = await request(server).post(API_PATH).send(userWithoutUsername);

      expect(response.status).toBe(StatusCode.BAD_REQUEST);
      expect(response.body.message).toEqual(ErrorMessage.MissingUserFields);
    });

    it('should return an error for missing age field', async () => {
      const userWithoutAge = {
        username: 'Peter',
        hobbies: ['tennis', 'tourism'],
      };
      const response = await request(server).post(API_PATH).send(userWithoutAge);

      expect(response.status).toBe(StatusCode.BAD_REQUEST);
      expect(response.body.message).toEqual(ErrorMessage.MissingUserFields);
    });

    it('should return an error for missing hobbies field', async () => {
      const userWithoutHobbies = {
        username: 'Peter',
        age: 56,
      };
      const response = await request(server).post(API_PATH).send(userWithoutHobbies);

      expect(response.status).toBe(StatusCode.BAD_REQUEST);
      expect(response.body.message).toEqual(ErrorMessage.MissingUserFields);
    });

    it('should return an error for invalid data type of username field', async () => {
      const userWithInvalidUsernameType = {
        username: 42,
        age: 56,
        hobbies: ['tennis', 'tourism'],
      };
      const response = await request(server).post(API_PATH).send(userWithInvalidUsernameType);

      expect(response.status).toBe(StatusCode.BAD_REQUEST);
      expect(response.body.message).toEqual(ErrorMessage.InvalidUsername);
    });

    it('should return an error for invalid data type of age field', async () => {
      const userWithInvalidAgeType = {
        username: 'Peter',
        age: '56',
        hobbies: ['tennis', 'tourism'],
      };
      const response = await request(server).post(API_PATH).send(userWithInvalidAgeType);

      expect(response.status).toBe(StatusCode.BAD_REQUEST);
      expect(response.body.message).toEqual(ErrorMessage.InvalidAge);
    });

    it('should return an error for invalid data type of hobbies field', async () => {
      const userWithInvalidHobbiesType = {
        username: 'Peter',
        age: 56,
        hobbies: ['tennis', 13],
      };
      const response = await request(server).post(API_PATH).send(userWithInvalidHobbiesType);

      expect(response.status).toBe(StatusCode.BAD_REQUEST);
      expect(response.body.message).toEqual(ErrorMessage.InvalidHobbies);
    });
  });

  describe('PUT /api/users/:userId', () => {
    const userId = mockedUsers[0].id;

    it('should return an error for missing username field', async () => {
      const userWithoutUsername = {
        age: 56,
        hobbies: ['tennis', 'tourism'],
      };
      const response = await request(server).put(`${API_PATH}/${userId}`).send(userWithoutUsername);

      expect(response.status).toBe(StatusCode.BAD_REQUEST);
      expect(response.body.message).toEqual(ErrorMessage.MissingUserFields);
    });

    it('should return an error for missing age field', async () => {
      const userWithoutAge = {
        username: 'Peter',
        hobbies: ['tennis', 'tourism'],
      };
      const response = await request(server).put(`${API_PATH}/${userId}`).send(userWithoutAge);

      expect(response.status).toBe(StatusCode.BAD_REQUEST);
      expect(response.body.message).toEqual(ErrorMessage.MissingUserFields);
    });

    it('should return an error for missing hobbies field', async () => {
      const userWithoutHobbies = {
        username: 'Peter',
        age: 56,
      };
      const response = await request(server).put(`${API_PATH}/${userId}`).send(userWithoutHobbies);

      expect(response.status).toBe(StatusCode.BAD_REQUEST);
      expect(response.body.message).toEqual(ErrorMessage.MissingUserFields);
    });

    it('should return an error for invalid data type of username field', async () => {
      const userWithInvalidUsernameType = {
        username: 42,
        age: 56,
        hobbies: ['tennis', 'tourism'],
      };
      const response = await request(server).put(`${API_PATH}/${userId}`).send(userWithInvalidUsernameType);

      expect(response.status).toBe(StatusCode.BAD_REQUEST);
      expect(response.body.message).toEqual(ErrorMessage.InvalidUsername);
    });

    it('should return an error for invalid data type of age field', async () => {
      const userWithInvalidAgeType = {
        username: 'Peter',
        age: '56',
        hobbies: ['tennis', 'tourism'],
      };
      const response = await request(server).put(`${API_PATH}/${userId}`).send(userWithInvalidAgeType);

      expect(response.status).toBe(StatusCode.BAD_REQUEST);
      expect(response.body.message).toEqual(ErrorMessage.InvalidAge);
    });

    it('should return an error for invalid data type of hobbies field', async () => {
      const userWithInvalidHobbiesType = {
        username: 'Peter',
        age: 56,
        hobbies: ['tennis', 13],
      };
      const response = await request(server).put(`${API_PATH}/${userId}`).send(userWithInvalidHobbiesType);

      expect(response.status).toBe(StatusCode.BAD_REQUEST);
      expect(response.body.message).toEqual(ErrorMessage.InvalidHobbies);
    });
  });
});
