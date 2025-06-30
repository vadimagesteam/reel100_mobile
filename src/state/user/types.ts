export interface AuthState {
  loading: boolean;
  isAuth: boolean;
  isStatus: StatusRegisterType | null;
  user: UserType | null;
  error: Error | null;
}

export type StatusRegisterType = {
  email: string;
  status: string;
};

//Actions
export type RegisterDataType = {
  username: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
};

export type VerifyUserType = {
  username: string;
  token: string;
};

export type ResendVerifyUserType = {
  username: string;
};

export type LoginDataType = {
  username: string;
  password: string;
};

export type ForgotPassType = {
  username: string;
};

export type ResetPassType = {
  username: string;
  token: string;
  password: string;
  confirmPassword: string;
};

export type UserStatsType = {
  followCount: number;
  followerCount: number;
  commentCount: number;
  likeCount: number;
};

export type UserType = {
  id: string | undefined;
  username: string;
  firstName: string;
  lastName: string;
  roles: string[];
  status: 'Active' | 'Pending' | string;
  createdAt: string;
  updatedAt: string;
  resetPasswordToken: string | null;
  stats: UserStatsType;
  follows: { id: string }[];
  whoms: { id: string }[];
};
