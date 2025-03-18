import React, { useState } from 'react';
import { SafeAreaView, View } from 'react-native';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { useForm } from 'react-hook-form';
import { colors, positionHelpers } from '../../../styles';
import { BodyText, ButtonDefault } from '../../../components/UI';
import FormContainer from '../../../components/Layout/FormContainer';
import LoginForm from './components/LoginForm';
import BackButton from '../../../components/navigator/BackButton';
import ButtonGradient from '../../../components/ButtonGradient';
import { ONBOARDING_ROUTES, OnboardingRoutes } from '../../../navigation/routes';

const SIGNIN_TEXT = 'Sign in';
const FORGOT_YOUR_PASS_TEXT = 'Forgot your password?';

interface FormData {
    username?: string;
    password?: string;
}

const LoginScreen = () => {
    const navigation = useNavigation<NavigationProp<OnboardingRoutes>>();
    const { control, handleSubmit } = useForm<FormData>({
        defaultValues: {
            username: '',
            password: '',
        },
    });
    const [securityPass, setSecurityPass] = useState<boolean>(true);

    const onSignin = (data: FormData) => {
        const dataSignIn = {
            username: data?.username,
            password: data?.password,
        };

        console.log('dataSignIn-->', dataSignIn);
    };

    return (
        <SafeAreaView style={[positionHelpers.fill, { backgroundColor: colors.black4 }]} >
            <BackButton onPress={() => navigation.goBack()} />
            <FormContainer>
                <View style={positionHelpers.mh20}>
                    <BodyText color={colors.white} fontSize={40} fontWeight={'bold'} textAlign="center" marginBottom={0}>{SIGNIN_TEXT}</BodyText>
                    <LoginForm
                        control={control}
                        securityPass={securityPass}
                        setSecurityPass={setSecurityPass}
                    />
                    <ButtonGradient
                        title={SIGNIN_TEXT}
                        buttonStyles={[positionHelpers.mt10, positionHelpers.mb10]}
                        onPress={handleSubmit(onSignin)}
                    />
                    <ButtonDefault onPress={() => navigation.navigate(ONBOARDING_ROUTES.FORGOT_PASSWORD_SCREEN)}>
                        <BodyText
                            color={colors.blue1}
                            fontSize={14}
                            fontWeight={'400'}
                            textAlign="center"
                            textDecorationLine="underline"
                            padding={10}
                        >
                            {FORGOT_YOUR_PASS_TEXT}
                        </BodyText>
                    </ButtonDefault>
                </View>
            </FormContainer>
        </SafeAreaView>
    );
};

export default LoginScreen;
