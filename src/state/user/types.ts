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

export type UserBase = {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  roles: string[];
  status: 'Active' | 'Pending' | string;
  createdAt: string;
  updatedAt: string;
  avatar?: string | null;
};

export type NotificationSettings = {
  likes: boolean;
  comments: boolean;
  followers: boolean;
  messages: boolean;
};

export type ProfileSettings = {
  notifications: NotificationSettings;
};

export type UserProfile = UserBase & {
  resetPasswordToken: string | null;
  stats: UserStatsType;
  settings: ProfileSettings;
};

export type RelationId = string;

export type UserType = UserBase & {
  stats: UserStatsType;
  follows: {
    id: RelationId;
    whom: UserBase;
  }[];
  whoms: {
    id: RelationId;
    who: UserBase;
  }[];
};

export type UpdateProfileInput = Partial<Pick<UserProfile, 'firstName' | 'lastName' | 'settings'>>;
