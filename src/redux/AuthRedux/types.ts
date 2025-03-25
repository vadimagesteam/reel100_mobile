export interface AuthState {
    loading: boolean;
    isAuth: boolean;
    user: any[];
    error: Error | null;
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
    },
    navigation: any
}

export type LoginDataType = {
    username: string | undefined
    password: string | undefined
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
