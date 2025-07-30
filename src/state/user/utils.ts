import pick from 'lodash.pick';
import { UserBase, UserProfile, UserType } from './types';

export const getFullName = <T extends Pick<UserBase, 'firstName' | 'lastName'>>(
  user: T,
): string => {
  return `${user.firstName} ${user.lastName}`;
};

export const extractUserBase = (user: UserType | UserProfile): UserBase =>
  pick(user, [
    'id',
    'firstName',
    'lastName',
    'username',
    'createdAt',
    'updatedAt',
    'status',
    'roles',
    'nickname',
    'avatar',
  ]);
