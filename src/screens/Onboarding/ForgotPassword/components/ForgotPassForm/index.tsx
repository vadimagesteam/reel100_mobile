import React from 'react';
import { Control, Controller, FieldValues } from 'react-hook-form';

// components, styles
import { positionHelpers } from '../../../../../styles';
import { cs } from './styles';
import { Input } from '../../../../../components/UI';

interface ForgotPassFormProps {
    control: Control<FieldValues, any>;
}

const EMAIL_TEXT = 'Email';

const ForgotPassForm = ({ control }: ForgotPassFormProps) => {
    return (
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
    );
};

export default ForgotPassForm
    ;
