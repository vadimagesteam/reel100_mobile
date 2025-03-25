import React from 'react';
import { Control, Controller, FieldErrors } from 'react-hook-form';

// components, styles
import { colors, positionHelpers } from '../../../../../styles';
import { cs } from './styles';
import { BodyText, Input } from '../../../../../components/UI';
import { FormData } from '../../types';

interface SignUpFormProps {
    control: Control<FormData>;
    errors: FieldErrors<FormData>;
    securityPass: boolean;
    securityConfirmPass: boolean
    setSecurityPass: (val: boolean) => void;
    setSecurityConfirmPass: (val: boolean) => void;
}

const EMAIL_TEXT = 'Email';
const FIRST_NAME_TEXT = 'First name';
const LAST_NAME_TEXT = 'Last name';
const PASSWORD_TEXT = 'Password';
const PASSWORD_CONFIRM_TEXT = 'Confirm Password';

const SignUpForm = ({ control, errors, securityPass, setSecurityPass, securityConfirmPass, setSecurityConfirmPass }: SignUpFormProps) => {
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
                    required: 'First name is required',
                }}
                render={({ field: { onChange, onBlur, value } }) => {
                    return (
                        <Input
                            containerStyles={positionHelpers.mt20}
                            inputStyles={[
                                cs.containerInputEmail,
                                {
                                    borderColor: errors?.firstName?.message ? colors.red : colors.white,
                                    backgroundColor: errors?.firstName?.message ? colors.redLight : colors.white,
                                },
                            ]}
                            titleStyles={cs.inputText}
                            title={FIRST_NAME_TEXT}
                            placeholder={FIRST_NAME_TEXT}
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                        />
                    );
                }}
                name="firstName"
            />
            {errors?.firstName && errors?.firstName?.message && (
                <BodyText paddingLeft={3} paddingTop={2} color={colors.red}>{errors?.firstName?.message}</BodyText>
            )}
            <Controller
                control={control}
                rules={{
                    required: 'Last name is required',
                }}
                render={({ field: { onChange, onBlur, value } }) => {
                    return (
                        <Input
                            containerStyles={positionHelpers.mt20}
                            inputStyles={[
                                cs.containerInputEmail,
                                {
                                    borderColor: errors?.lastName?.message ? colors.red : colors.white,
                                    backgroundColor: errors?.lastName?.message ? colors.redLight : colors.white,
                                },
                            ]}
                            titleStyles={cs.inputText}
                            title={LAST_NAME_TEXT}
                            placeholder={LAST_NAME_TEXT}
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                        />
                    );
                }}
                name="lastName"
            />
            {errors?.lastName && errors?.lastName?.message && (
                <BodyText paddingLeft={3} paddingTop={2} color={colors.red}>{errors?.lastName?.message}</BodyText>
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
            <Controller
                control={control}
                rules={{
                    required: 'Confirm password is required',
                    validate: (value, formValues) =>
                        value === formValues.password || 'Passwords do not match',
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                        containerStyles={positionHelpers.mt20}
                        inputStyles={[
                            cs.containerInputPassword,
                            {
                                borderColor: errors?.confirmPassword?.message ? colors.red : colors.white,
                                backgroundColor: errors?.confirmPassword?.message ? colors.redLight : colors.white,
                            },
                        ]}
                        titleStyles={cs.inputText}
                        title={PASSWORD_CONFIRM_TEXT}
                        placeholder={PASSWORD_CONFIRM_TEXT}
                        onChangeText={onChange}
                        value={value}
                        onBlur={onBlur}
                        isSecurity
                        security={securityConfirmPass}
                        secureTextEntry={securityConfirmPass}
                        onSecure={() => setSecurityConfirmPass(!securityConfirmPass)}
                    />
                )}
                name="confirmPassword"
            />
            {errors?.confirmPassword && errors?.confirmPassword?.message && (
                <BodyText paddingLeft={3} paddingTop={2} color={colors.red}>{errors?.confirmPassword?.message}</BodyText>
            )}
        </>
    );
};

export default SignUpForm;
