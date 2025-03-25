import React from 'react';
import { Control, Controller, FieldErrors } from 'react-hook-form';

// components, styles
import { colors, positionHelpers } from '../../../../../styles';
import { cs } from './styles';
import { BodyText, Input } from '../../../../../components/UI';
import { FormData } from '../../types';

interface ForgotPassFormProps {
    control: Control<FormData>;
    errors: FieldErrors<FormData>;
}

const EMAIL_TEXT = 'Email';

const ForgotPassForm = ({ control, errors }: ForgotPassFormProps) => {
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
        </>

    );
};

export default ForgotPassForm
    ;
