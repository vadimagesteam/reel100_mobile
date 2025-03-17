import React, { useState } from 'react';
import { SafeAreaView, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useForm } from 'react-hook-form';
import LinearGradient from 'react-native-linear-gradient';
import { colors, positionHelpers } from '../../../styles';
import { BodyText, ButtonDefault } from '../../../components/UI';
import FormContainer from '../../../components/Layout/FormContainer';
import SignUpForm from './components/SignUpForm';
import BackButton from '../../../components/navigator/BackButton';

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
            <ButtonDefault buttoStyles={[positionHelpers.mh20, positionHelpers.mb10, positionHelpers.pt10]} onPress={handleSubmit(onSignup)}>
                <LinearGradient
                    start={{ x: 0.1, y: 0.5 }}
                    end={{ x: 0.9, y: 0 }}
                    colors={[colors.blue1, colors.blue]}
                    style={positionHelpers.br5}
                >
                    <BodyText fontSize={18} fontWeight={'bold'} color={colors.white} textAlign="center" margin={15}>{SIGNUP_TEXT}</BodyText>
                </LinearGradient>
            </ButtonDefault>
        </SafeAreaView>
    );
};

export default SignupScreen;
