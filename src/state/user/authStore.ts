import {
  RegisterDataType,
  VerifyUserType,
  ResendVerifyUserType,
  LoginDataType,
  ForgotPassType,
  ResetPassType,
  UserType,
} from './types';
import { api } from '../../lib/api.ts';
import { AxiosError } from 'axios';
import { createPersistStore } from '../../lib/createPersistStore.ts';
import omit from 'lodash.omit';

type ActionResult =
  | {
      type: 'success';
    }
  | {
      type: 'error';
      errorType:
        | 'unknown'
        | 'verification_required'
        | 'invalid_credentials'
        | 'email_exists'
        | 'verification_code_invalid';
      message: string;
    };

type AuthState = {
  loading: boolean;
  isAuthenticated: boolean;
  user: UserType | null;
  token: string | null;
  pendingVerification: null | {
    username: string;
  };
  actions: {
    logout: () => Promise<void>;
    loadUserProfile: () => Promise<void>;
    setToken: (token: string) => Promise<void>;
    register: (data: RegisterDataType) => Promise<ActionResult>;
    verifyUser: (data: VerifyUserType) => Promise<ActionResult>;
    resendVerification: (data: ResendVerifyUserType) => Promise<ActionResult>;
    login: (payload: LoginDataType) => Promise<ActionResult>;
    forgotPassword: (data: ForgotPassType) => Promise<ActionResult>;
    resetPassword: (data: ResetPassType) => Promise<ActionResult>;
  };
};

export const useAuthStore = createPersistStore<AuthState>(
  (set, get) => ({
    loading: false,
    isAuthenticated: false,
    user: null,
    token: null,
    pendingVerification: null,

    actions: {
      logout: async () => {
        set({
          isAuthenticated: false,
          user: null,
          loading: false,
        });
      },

      setToken: async (token) => {
        set({ token });
      },

      loadUserProfile: async () => {
        const response = await api.get('/api/users/me');
        set({
          isAuthenticated: true,
          user: response.data,
        });
      },

      login: async (payload) => {
        try {
          set({ loading: true });
          const res = await api.post('/api/login', payload);

          console.log('LOGIN RESPONSE', res.data);

          if (res.data.status !== 'Active') {
            set({
              pendingVerification: { username: res.data.username },
            });
            return {
              type: 'error',
              errorType: 'verification_required',
              message: 'Email verification required',
            };
          }

          set({
            pendingVerification: null,
            isAuthenticated: true,
            user: res.data,
            token: res.data.accessToken,
          });

          await get().actions.loadUserProfile();

          return { type: 'success' };
        } catch (error) {
          if (error instanceof AxiosError && error.status === 401) {
            return {
              type: 'error',
              errorType: 'invalid_credentials',
              message: error.response?.data.message ?? 'unknown',
            };
          }
          console.log('Unknown error occured', error);
          return { type: 'error', errorType: 'unknown', message: 'Unknown error occurred.' };
        } finally {
          set({ loading: false });
        }
      },

      forgotPassword: async (payload) => {
        try {
          set({ loading: true });
          await api.post('/api/setResetPassword', payload);
          return { type: 'success' };
        } catch (error) {
          if (error instanceof AxiosError && error.status === 401) {
            return {
              type: 'error',
              errorType: 'invalid_credentials',
              message: error.response?.data.message,
            };
          }
          return { type: 'error', errorType: 'unknown', message: 'Unknown error occurred.' };
        } finally {
          set({ loading: false });
        }
      },

      resetPassword: async (payload) => {
        try {
          set({ loading: true });
          const result = await api.post('/api/resetPassword', payload);
          console.log('reset action', payload, result);
          return { type: 'success' };
        } catch (error) {
          if (error instanceof AxiosError && error.status === 401) {
            return {
              type: 'error',
              errorType: 'invalid_credentials',
              message: error.response?.data.message,
            };
          }
          return { type: 'error', errorType: 'unknown', message: 'Unknown error occurred.' };
        } finally {
          set({ loading: false });
        }
      },

      register: async (payload) => {
        try {
          set({ loading: true });
          const response = await api.post('/api/register', payload);
          set({
            pendingVerification: { username: response.data.username },
          });
          return { type: 'success' };
        } catch (error) {
          console.log('[register]', error);
          if (error instanceof AxiosError && error.status === 401) {
            set({
              pendingVerification: { username: payload.username },
            });
            return {
              type: 'error',
              errorType: 'email_exists',
              message:
                'This account is already registered. Please check your email and enter the verification code to confirm your email address.',
            };
          }
          return { type: 'error', errorType: 'unknown', message: 'Unknown error occurred.' };
        } finally {
          set({ loading: false });
        }
      },

      verifyUser: async (payload) => {
        try {
          set({ loading: true });

          const response = await api.post('/api/verifyUser', payload);
          console.log('[verifyUser]', response?.data);

          set({
            pendingVerification: null,
            token: response.data.accessToken,
          });
          await get().actions.loadUserProfile();

          return { type: 'success' };
        } catch (error) {
          if (error instanceof AxiosError && error.status === 401) {
            return {
              type: 'error',
              errorType: 'verification_code_invalid',
              message: 'Verification code is invalid',
            };
          }
          return { type: 'error', errorType: 'unknown', message: 'Unknown error occurred.' };
        } finally {
          set({ loading: false });
        }
      },

      resendVerification: async (payload) => {
        try {
          set({ loading: true });
          console.log('[resendVerification] payload', payload);
          const response = await api.post('/api/resendVerificationCode', payload);

          console.log('[resendVerification] response', response);

          return { type: 'success' };
        } catch (error) {
          if (error instanceof AxiosError && error.status === 401) {
            return {
              type: 'error',
              errorType: 'invalid_credentials',
              message: 'Invalid credentials.',
            };
          }
          return { type: 'error', errorType: 'unknown', message: 'Unknown error occurred.' };
        } finally {
          set({ loading: false });
        }
      },
    },
  }),
  {
    version: 0,
    ignore: ['loading'],
    name: 'AuthState',
  },
);

export const useIsAuthenticated = () => useAuthStore((s) => s.isAuthenticated);
export const useUser = () => useAuthStore(({ user }) => user!);
export const useAuthActions = () => useAuthStore(({ actions }) => actions);
