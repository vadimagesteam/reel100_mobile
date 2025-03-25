import React, { useState } from 'react';
import { SafeAreaView, View } from 'react-native';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { useForm } from 'react-hook-form';
import { colors, positionHelpers } from '../../../styles';
import { BodyText } from '../../../components/UI';
import FormContainer from '../../../components/Layout/FormContainer';
import SignUpForm from './components/SignUpForm';
import BackButton from '../../../components/navigator/BackButton';
import { OnboardingRoutes } from '../../../navigation/routes';
import ButtonGradient from '../../../components/ButtonGradient';
import { useReduxDispatch, useReduxSelector } from '../../../store/store';
import { userRegisterAction } from '../../../redux/AuthRedux/authAction';
import { FormData } from './types';
import { clearErrors } from '../../../redux/AuthRedux/authSlice';

const SIGNUP_TEXT = 'Sign up';

const SignupScreen = () => {
    const navigation = useNavigation<NavigationProp<OnboardingRoutes>>();
    const dispatch = useReduxDispatch();
    const { loading, error } = useReduxSelector(state => state?.auth);
    const [securityPass, setSecurityPass] = useState<boolean>(true);
    const [securityConfirmPass, setSecurityConfirmPass] = useState<boolean>(true);
    const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
        defaultValues: {
            username: '',
            password: '',
            confirmPassword: '',
            firstName: '',
            lastName: '',
        },
    });

    const goBackCallback = () => {
        navigation.goBack();
        dispatch(clearErrors());
    };

    const onSignup = (data: FormData) => {
        const dataSignUp = {
            registerData: {
                username: data?.username,
                password: data?.password,
                confirmPassword: data?.confirmPassword,
                firstName: data?.firstName,
                lastName: data?.lastName,
            },
            navigation,
        };
        dispatch(userRegisterAction(dataSignUp));
    };

    return (
        <SafeAreaView style={[positionHelpers.fill, { backgroundColor: colors.black4 }]} >
            <BackButton onPress={() => goBackCallback()} />
            <FormContainer>
                <View style={positionHelpers.mh20}>
                    <BodyText color={colors.white} fontSize={40} fontWeight={'bold'} textAlign="center" marginBottom={0}>{SIGNUP_TEXT}</BodyText>
                    <SignUpForm
                        control={control}
                        errors={errors}
                        securityPass={securityPass}
                        setSecurityPass={setSecurityPass}
                        securityConfirmPass={securityConfirmPass}
                        setSecurityConfirmPass={setSecurityConfirmPass}
                    />
                    {!!error?.message && (
                        <BodyText marginTop={20} textAlign="center" color={colors.red}>{error?.message}</BodyText>
                    )}
                </View>
            </FormContainer>
            <ButtonGradient
                disabled={loading}
                loading={loading}
                buttonStyles={positionHelpers.mh20}
                title={SIGNUP_TEXT}
                onPress={handleSubmit(onSignup)}
            />
        </SafeAreaView>
    );
};

export default SignupScreen;
