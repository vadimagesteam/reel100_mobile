export interface AuthState {
    loading: boolean;
    isAuth: boolean;
    isStatus: StatusRegisterType | null
    user: UserType | null;
    error: Error | null;
}

export type StatusRegisterType = {
    email: string,
    status: string
}

//Actions
export type RegisterDataType = {
    registerData: {
        username: string | undefined,
        password: string | undefined,
        confirmPassword: string | undefined,
        firstName: string | undefined,
        lastName: string | undefined,
    },
    navigation: any,
}

export type VerifyUserType = {
    verifyEmailData: {
        username: string
        token: string
    }
}

export type ResendVerifyUserType = {
    resendVerifyEmailData: {
        username: string
    },
}

export type LoginDataType = {
    dataLogin: {
        username: string | undefined
        password: string | undefined
    },
    navigation: any
}

export type ForgotPassType = {
    forgotPassData: {
        username: string | undefined
    },
    navigation: any
}

export type ResetPassType = {
    resetPassData: {
        username: string | undefined,
        token: string | undefined,
        password: string | undefined,
        confirmPassword: string | undefined,
    },
    navigation: any
}


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
    password: string;
    roles: string[];
    status: 'Active' | 'Pending' | string;
    createdAt: string;
    updatedAt: string;
    resetPasswordToken: string | null;
    verificationToken: string | null | string;
    stats: UserStatsType;
};
