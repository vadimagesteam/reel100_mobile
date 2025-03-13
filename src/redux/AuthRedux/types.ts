export interface AuthState {
    loading: boolean;
    isAuth: boolean;
    user: any[];
    error: Error | null;
}
