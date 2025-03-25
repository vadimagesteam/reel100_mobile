import React from 'react';
import { SafeAreaView, View } from 'react-native';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { useForm } from 'react-hook-form';
import ButtonGradient from '../../../components/ButtonGradient';
import { BodyText } from '../../../components/UI';
import BackButton from '../../../components/navigator/BackButton';
import { colors, positionHelpers } from '../../../styles';
import ForgotPassForm from './components/ForgotPassForm';
import { OnboardingRoutes } from '../../../navigation/routes';
import { FormData } from './types';
import { useReduxDispatch, useReduxSelector } from '../../../store/store';
import { forgotPasswordAction } from '../../../redux/AuthRedux/authAction';
import { clearErrors } from '../../../redux/AuthRedux/authSlice';

const SEND_TEXT = 'Send';
const FORGOT_YOUR_PASS_TEXT = 'Forgot your password?';
const FORGOT_PASS_INFO_TEXT = 'Enter your email address and we will send you a code to reset your password.';

const ForgotPasswordScreen = () => {
    const navigation = useNavigation<NavigationProp<OnboardingRoutes>>();
    const dispatch = useReduxDispatch();
    const { loading, error } = useReduxSelector(state => state?.auth);
    const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
        defaultValues: {
            username: '',
        },
    });

    const goBackCallback = () => {
        navigation.goBack();
        dispatch(clearErrors());
    };

    const sendCodeClick = (data: FormData) => {
        const dataForgotPass = {
            forgotPassData: {
                username: data?.username, //email
            },
            navigation,
        };
        dispatch(forgotPasswordAction(dataForgotPass));
    };


    return (
        <SafeAreaView style={[positionHelpers.fill, { backgroundColor: colors.black4 }]} >
            <BackButton onPress={() => goBackCallback()} />
            <View style={positionHelpers.mh20}>
                <BodyText color={colors.white} fontSize={20} fontWeight={'bold'} textAlign="center">{FORGOT_YOUR_PASS_TEXT}</BodyText>
                <BodyText
                    color={colors.white}
                    fontSize={12}
                    fontWeight={'400'}
                    textAlign="center"
                    marginTop={5}
                    marginHorizontal={30}
                >
                    {FORGOT_PASS_INFO_TEXT}
                </BodyText>
                <ForgotPassForm
                    control={control}
                    errors={errors}
                />
                {!!error?.message && (
                    <BodyText marginTop={20} textAlign="center" color={colors.red}>{error?.message}</BodyText>
                )}
                <ButtonGradient
                    disabled={loading}
                    loading={loading}
                    title={SEND_TEXT}
                    buttonStyles={[positionHelpers.mt10, positionHelpers.mb10]}
                    onPress={handleSubmit(sendCodeClick)}
                />
            </View>
        </SafeAreaView>
    );
};

export default ForgotPasswordScreen;
