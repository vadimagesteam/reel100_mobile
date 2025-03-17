import React from 'react';
import { Control, Controller, FieldValues } from 'react-hook-form';

// components, styles
import { positionHelpers } from '../../../../../styles';
import { cs } from './styles';
import { Input } from '../../../../../components/UI';

interface LoginFormProps {
    control: Control<FieldValues, any>;
    securityPass: boolean;
    setSecurityPass: (val: boolean) => void;
}

const EMAIL_TEXT = 'Email';
const PASSWORD_TEXT = 'Password';

const LoginForm = ({ control, securityPass, setSecurityPass }: LoginFormProps) => {
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
        </>
    );
};

export default LoginForm;
