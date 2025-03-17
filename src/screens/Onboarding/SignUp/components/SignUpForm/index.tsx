import React from 'react';
import { Control, Controller, FieldValues } from 'react-hook-form';

// components, styles
import { positionHelpers } from '../../../../../styles';
import { cs } from './styles';
import { Input } from '../../../../../components/UI';

interface SignUpFormProps {
    control: Control<FieldValues, any>;
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

const SignUpForm = ({ control, securityPass, setSecurityPass, securityConfirmPass, setSecurityConfirmPass }: SignUpFormProps) => {
    return (
        <>
            <Controller
                control={control}
                rules={{
                    required: false,
                }}
                render={({ field: { onChange, onBlur, value } }) => {
                    return (
                        <Input
                            containerStyles={positionHelpers.mt20}
                            inputStyles={cs.containerInputEmail}
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
            <Controller
                control={control}
                rules={{
                    required: false,
                }}
                render={({ field: { onChange, onBlur, value } }) => {
                    return (
                        <Input
                            containerStyles={positionHelpers.mt20}
                            inputStyles={cs.containerInputEmail}
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
            <Controller
                control={control}
                rules={{
                    required: false,
                }}
                render={({ field: { onChange, onBlur, value } }) => {
                    return (
                        <Input
                            containerStyles={positionHelpers.mt20}
                            inputStyles={cs.containerInputEmail}
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
            <Controller
                control={control}
                rules={{
                    required: false,
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                        containerStyles={positionHelpers.mt20}
                        inputStyles={cs.containerInputPassword}
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
            <Controller
                control={control}
                rules={{
                    required: false,
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                        containerStyles={positionHelpers.mt20}
                        inputStyles={cs.containerInputPassword}
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
        </>
    );
};

export default SignUpForm;
