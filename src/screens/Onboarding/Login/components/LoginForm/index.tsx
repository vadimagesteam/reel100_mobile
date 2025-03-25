import React from 'react';
import { Control, Controller, FieldErrors } from 'react-hook-form';

// components, styles
import { colors, positionHelpers } from '../../../../../styles';
import { cs } from './styles';
import { BodyText, Input } from '../../../../../components/UI';
import { FormData } from '../../types';

interface LoginFormProps {
    control: Control<FormData>;
    errors: FieldErrors<FormData>;
    securityPass: boolean;
    setSecurityPass: (val: boolean) => void;
}

const EMAIL_TEXT = 'Email';
const PASSWORD_TEXT = 'Password';

const LoginForm = ({ control, errors, securityPass, setSecurityPass }: LoginFormProps) => {
    return (
        <>
            <Controller
                control={control}
                rules={{
                    required: 'Email is required',
                    pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: 'Invalid email format',
                    },
                }}
                render={({ field: { onChange, onBlur, value } }) => {
                    return (
                        <Input
                            containerStyles={positionHelpers.mt20}
                            inputStyles={[
                                cs.containerInputEmail,
                                {
                                    borderColor: errors?.username?.message ? colors.red : colors.white,
                                    backgroundColor: errors?.username?.message ? colors.redLight : colors.white,
                                },
                            ]}
                            titleStyles={cs.inputText}
                            title={EMAIL_TEXT}
                            placeholder={EMAIL_TEXT}
                            keyboardType="email-address"
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                        />
                    );
                }}
                name="username"
            />
            {errors?.username && errors?.username?.message && (
                <BodyText paddingLeft={3} paddingTop={2} color={colors.red}>{errors?.username?.message}</BodyText>
            )}
            <Controller
                control={control}
                rules={{
                    required: 'Password is required',
                    minLength: {
                        value: 6,
                        message: 'Password must be at least 6 characters long',
                    },
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                        containerStyles={positionHelpers.mt20}
                        inputStyles={[
                            cs.containerInputPassword,
                            {
                                borderColor: errors?.password?.message ? colors.red : colors.white,
                                backgroundColor: errors?.password?.message ? colors.redLight : colors.white,
                            },
                        ]}
                        titleStyles={cs.inputText}
                        title={PASSWORD_TEXT}
                        placeholder={PASSWORD_TEXT}
                        onChangeText={onChange}
                        value={value}
                        onBlur={onBlur}
                        isSecurity
                        security={securityPass}
                        secureTextEntry={securityPass}
                        onSecure={() => setSecurityPass(!securityPass)}
                    />
                )}
                name="password"
            />
            {errors?.password && errors?.password?.message && (
                <BodyText paddingLeft={3} paddingTop={2} color={colors.red}>{errors?.password?.message}</BodyText>
            )}
        </>
    );
};

export default LoginForm;
