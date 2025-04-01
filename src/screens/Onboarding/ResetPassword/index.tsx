import React, { useEffect, useState } from 'react';
import { SafeAreaView, View } from 'react-native';
import FormContainer from '../../../components/Layout/FormContainer';
import ButtonGradient from '../../../components/ButtonGradient';
import { colors, positionHelpers } from '../../../styles';
import { BodyText } from '../../../components/UI';
import BackButton from '../../../components/navigator/BackButton';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useForm } from 'react-hook-form';
import ResetPassForm from './components/ResetPassForm';
import { FormData } from './types';
import { useReduxDispatch, useReduxSelector } from '../../../store/store';
import { resetPasswordAction } from '../../../redux/AuthRedux/authAction';
import { usePaddingInsets } from '../../../utils/paddingInsets';

const NEW_PASSWORD_TEXT = 'New password';
const CONFIRM_TEXT = 'Confirm';

const ResetPasswordScreen = () => {
    const navigation = useNavigation();
    const { params } = useRoute<any>();
    const dispatch = useReduxDispatch();
    const { loading } = useReduxSelector(state => state?.auth);
    const { control, handleSubmit, setValue, formState: { errors } } = useForm<FormData>({
        defaultValues: {
            username: '',
            code: '',
            password: '',
            confirmPassword: '',
        },
    });
    const [securityPass, setSecurityPass] = useState<boolean>(true);
    const [securityConfirmPass, setSecurityConfirmPass] = useState<boolean>(true);

    useEffect(() => {
        setValue('username', params?.email);
    }, [setValue, params]);

    const resetPasswordClick = (data: FormData) => {
        const dataResetPass = {
            resetPassData: {
                username: data?.username, //email
                token: data?.code, // code (4)
                password: data?.password,
                confirmPassword: data?.confirmPassword,
            },
            navigation,
        };
        console.log('dataResetPass-> ', JSON.stringify(dataResetPass, null, 2));
        dispatch(resetPasswordAction(dataResetPass));
    };

    return (
        <SafeAreaView style={[positionHelpers.fill, { backgroundColor: colors.black4, paddingTop: usePaddingInsets() }]} >
            <BackButton onPress={() => navigation.goBack()} />
            <FormContainer>
                <View style={positionHelpers.mh20}>
                    <BodyText color={colors.white} fontSize={40} fontWeight={'bold'} textAlign="center" marginBottom={0}>{NEW_PASSWORD_TEXT}</BodyText>
                    <ResetPassForm
                        control={control}
                        errors={errors}
                        securityPass={securityPass}
                        setSecurityPass={setSecurityPass}
                        securityConfirmPass={securityConfirmPass}
                        setSecurityConfirmPass={setSecurityConfirmPass}
                    />

                </View>
            </FormContainer>
            <ButtonGradient
                disabled={loading}
                loading={loading}
                buttonStyles={positionHelpers.mh20}
                title={CONFIRM_TEXT}
                onPress={handleSubmit(resetPasswordClick)}
            />
        </SafeAreaView>
    );
};

export default ResetPasswordScreen;
