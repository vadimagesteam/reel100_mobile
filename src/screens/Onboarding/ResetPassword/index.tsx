import React, { useState } from 'react';
import { SafeAreaView, View } from 'react-native';
import FormContainer from '../../../components/Layout/FormContainer';
import ButtonGradient from '../../../components/ButtonGradient';
import { colors, positionHelpers } from '../../../styles';
import { BodyText } from '../../../components/UI';
import BackButton from '../../../components/navigator/BackButton';
import { useNavigation } from '@react-navigation/native';
import { useForm } from 'react-hook-form';
import ResetPassForm from './components/ResetPassForm';

const NEW_PASSWORD_TEXT = 'New password';
const SIGNIN_TEXT = 'Sign in';

interface FormData {
    username?: string;
    code?: string;
    password?: string;
    confirmPassword?: string
}

const ResetPasswordScreen = () => {
    const navigation = useNavigation();
    const { control, handleSubmit } = useForm<FormData>({
        defaultValues: {
            username: '',
            code: '',
            password: '',
            confirmPassword: '',
        },
    });
    const [securityPass, setSecurityPass] = useState<boolean>(true);
    const [securityConfirmPass, setSecurityConfirmPass] = useState<boolean>(true);

    const resetPasswordClick = (data: FormData) => {
        // const dataResetPass = {
        //     resetPassData: {
        //         username: data?.username, //email
        //         token: data?.code, // code (4)
        //         password: data?.password,
        //         confirmPassword: data?.confirmPassword,
        //     },
        // };
    };
    return (
        <SafeAreaView style={[positionHelpers.fill, { backgroundColor: colors.black4 }]} >
            <BackButton onPress={() => navigation.goBack()} />
            <FormContainer>
                <View style={positionHelpers.mh20}>
                    <BodyText color={colors.white} fontSize={40} fontWeight={'bold'} textAlign="center" marginBottom={0}>{NEW_PASSWORD_TEXT}</BodyText>
                    <ResetPassForm
                        control={control}
                        securityPass={securityPass}
                        setSecurityPass={setSecurityPass}
                        securityConfirmPass={securityConfirmPass}
                        setSecurityConfirmPass={setSecurityConfirmPass}
                    />

                </View>
            </FormContainer>
            <ButtonGradient
                buttonStyles={positionHelpers.mh20}
                title={SIGNIN_TEXT}
                onPress={handleSubmit(resetPasswordClick)}
            />
        </SafeAreaView>
    );
};

export default ResetPasswordScreen;
