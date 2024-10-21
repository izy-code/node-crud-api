import { User } from '../common/types';
import { users } from './db-server';

export const getUsers = () => users;

export const getUser = (userId: User['id']) => users.find((user) => user.id === userId) || null;

export const createUser = (newUser: User) => {
  users.push(newUser);

  return newUser;
};

export const updateUser = (userId: User['id'], changes: Partial<User>) => {
  const updatedUserIndex = users.findIndex((user) => user.id === userId);

  if (updatedUserIndex !== -1) {
    users[updatedUserIndex] = { ...users[updatedUserIndex], ...changes };

    return users[updatedUserIndex];
  } else {
    return null;
  }
};

export const deleteUser = (userId: User['id']) => {
  const deletedUserIndex = users.findIndex((user) => user.id === userId);

  if (deletedUserIndex !== -1) {
    const [deletedUser] = users.splice(deletedUserIndex, 1);

    return deletedUser;
  } else {
    return null;
  }
};
