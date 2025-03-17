import React, { useState } from 'react';
import { SafeAreaView, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useForm } from 'react-hook-form';
import { colors, positionHelpers } from '../../../styles';
import { BodyText } from '../../../components/UI';
import FormContainer from '../../../components/Layout/FormContainer';
import SignUpForm from './components/SignUpForm';
import BackButton from '../../../components/navigator/BackButton';
import { ONBOARDING_ROUTES } from '../../../navigation/routes';
import ButtonGradient from '../../../components/ButtonGradient';

interface FormData {
    username?: string;
    password?: string;
    confirmPassword?: string
    firstName?: string
    lastName?: string
}

const SIGNUP_TEXT = 'Sign up';

const SignupScreen = () => {
    const navigation = useNavigation();
    const [securityPass, setSecurityPass] = useState<boolean>(true);
    const [securityConfirmPass, setSecurityConfirmPass] = useState<boolean>(true);
    const { control, handleSubmit } = useForm<FormData>({
        defaultValues: {
            username: '',
            password: '',
            confirmPassword: '',
            firstName: '',
            lastName: '',
        },
    });

    const onSignup = (data: FormData) => {
        const dataSignUp = {
            username: data?.username,
            password: data?.password,
            confirmPassword: data?.confirmPassword,
            firstName: data?.firstName,
            lastName: data?.lastName,
        };

        console.log('dataSignUp-->', dataSignUp);
        navigation.navigate(ONBOARDING_ROUTES.VERIFY_EMAIL_SCREEN);
    };


    return (
        <SafeAreaView style={[positionHelpers.fill, { backgroundColor: colors.black4 }]} >
            <BackButton onPress={() => navigation.goBack()} />
            <FormContainer>
                <View style={positionHelpers.mh20}>
                    <BodyText color={colors.white} fontSize={40} fontWeight={'bold'} textAlign="center" marginBottom={0}>{SIGNUP_TEXT}</BodyText>
                    <SignUpForm
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
                title={SIGNUP_TEXT}
                onPress={handleSubmit(onSignup)}
            />
        </SafeAreaView>
    );
};

export default SignupScreen;
