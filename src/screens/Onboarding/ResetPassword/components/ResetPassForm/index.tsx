import React from 'react';
import { Control, Controller, FieldValues } from 'react-hook-form';

// components, styles
import { positionHelpers } from '../../../../../styles';
import { Input } from '../../../../../components/UI';
import { cs } from './styles';

interface ResetPassFormProps {
    control: Control<FieldValues, any>;
    securityPass: boolean;
    securityConfirmPass: boolean
    setSecurityPass: (val: boolean) => void;
    setSecurityConfirmPass: (val: boolean) => void;
}

const EMAIL_TEXT = 'Email';
const CODE_TEXT = '4-digit code';
const PASSWORD_TEXT = 'Password';
const PASSWORD_CONFIRM_TEXT = 'Confirm Password';

const ResetPassForm = ({ control, securityPass, setSecurityPass, securityConfirmPass, setSecurityConfirmPass }: ResetPassFormProps) => {
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
                render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                        containerStyles={positionHelpers.mt20}
                        inputStyles={cs.containerInputPassword}
                        titleStyles={cs.inputText}
                        title={CODE_TEXT}
                        placeholder={CODE_TEXT}
                        onChangeText={onChange}
                        keyboardType="numeric"
                        maxLength={4}
                        value={value}
                        onBlur={onBlur}
                    />
                )}
                name="code"
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

export default ResetPassForm;
