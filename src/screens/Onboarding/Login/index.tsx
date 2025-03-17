import React, { useState } from 'react';
import { SafeAreaView, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useForm } from 'react-hook-form';
import { colors, positionHelpers } from '../../../styles';
import { BodyText } from '../../../components/UI';
import FormContainer from '../../../components/Layout/FormContainer';
import LoginForm from './components/LoginForm';
import BackButton from '../../../components/navigator/BackButton';
import ButtonGradient from '../../../components/ButtonGradient';

const SIGNIN_TEXT = 'Sign in';

interface FormData {
    username?: string;
    password?: string;
}

const LoginScreen = () => {
    const navigation = useNavigation();
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
                </View>
            </FormContainer>
            <ButtonGradient
                title={SIGNIN_TEXT}
                buttonStyles={positionHelpers.mh20}
                onPress={handleSubmit(onSignin)} />
        </SafeAreaView>
    );
};

export default LoginScreen;
