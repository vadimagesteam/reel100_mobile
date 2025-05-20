export interface UsersState {
    loading: boolean;
    usersData: UsersType[];
    userOneData: UserOneDataType | null
    error: Error | null;
}

export interface UsersType {
    id: string;
    username: string;
    firstName: string | null;
    lastName: string | null;
    status: 'Pending' | string;
    roles: string[];
    createdAt: string;
    updatedAt: string;
    resetPasswordToken: string | null;
    verificationToken: string | null;
    follows: any | null;
    whoms: any | null;
    messages: any | null;
    messagesTo: any | null;
}

export type UserStatsType = {
    followCount: number;
    followerCount: number;
    commentCount: number;
    likeCount: number;
};

export type FollowInfoType = {
    id: string;
};

export type UserOneDataType = {
    id: string;
    username: string;
    firstName: string | null;
    lastName: string | null;
    status: 'Pending' | string;
    roles: string[]; // e.g., ['user']
    createdAt: string; // ISO date string
    updatedAt: string;
    resetPasswordToken: string | null;
    verificationToken: string | null;
    follows: FollowInfoType | null;
    whoms: any | null;
    messages: any | null;
    messagesTo: any | null;
    stats: UserStatsType;
};
