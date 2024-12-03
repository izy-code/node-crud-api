import request from 'supertest';
import { server, shutdown } from '..';

jest.mock('../database/db-dispatcher', () => ({
  receiveAllUsers: jest.fn().mockImplementation(() => {
    throw new Error('Test error');
  }),
}));

describe('Application Error Handling', () => {
  afterAll(() => {
    shutdown();
  });

  it('should return an internal server error with mocked db-dispatcher that throws an error', async () => {
    const response = await request(server).get('/api/users');

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ message: 'Internal Server Error: Test error' });
  });
});
