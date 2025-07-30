import pick from 'lodash.pick';
import { UserBase, UserProfile, UserType } from './types';

export const getDisplayName = <T extends Pick<UserBase, 'firstName' | 'lastName' | 'nickname'>>(
  user: T,
): string => {
  if (user.nickname) {
    return user.nickname;
  }
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
