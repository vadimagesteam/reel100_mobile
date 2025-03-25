import React, { useState } from 'react';
import { SafeAreaView, View } from 'react-native';
import { NavigationProp, useNavigation, useRoute } from '@react-navigation/native';
import { colors, positionHelpers } from '../../../styles';
import { BodyText } from '../../../components/UI';
import BackButton from '../../../components/navigator/BackButton';
import PINcode from '../../../components/PINcode';
import ButtonGradient from '../../../components/ButtonGradient';
import { OnboardingRoutes } from '../../../navigation/routes';
import { useReduxDispatch, useReduxSelector } from '../../../store/store';
import { userVerifyAction } from '../../../redux/AuthRedux/authAction';

const CHECK_EMAIL_TEXT = 'Check your email';
const WE_SENT_CODE_TEXT = 'We sent a verification code to';
const VERIFY_TEXT = 'Verify';

const CODE_LENGTH = 4;

const VerifyEmailScreen = () => {
    const { params } = useRoute<any>();
    const navigation = useNavigation<NavigationProp<OnboardingRoutes>>();
    const dispatch = useReduxDispatch();
    const { loading } = useReduxSelector(state => state?.auth);
    const [code, setCode] = useState<string>('');

    const handleVerify = () => {
        const dataVerify = {
            verifyEmailData: {
                username: params?.email,
                token: String(code),
            },
            navigation,
        };
        dispatch(userVerifyAction(dataVerify));
    };

    return (
        <SafeAreaView style={[positionHelpers.fill, { backgroundColor: colors.black4 }]} >
            <BackButton onPress={() => navigation.goBack()} />
            <View style={[positionHelpers.mt20, positionHelpers.mb25, positionHelpers.mh20]}>
                <BodyText color={colors.white} fontSize={25} fontWeight={'bold'} textAlign="center" marginBottom={7}>{CHECK_EMAIL_TEXT}</BodyText>
                <View>
                    <BodyText color={colors.white} fontSize={14} fontWeight={'400'} textAlign="center" >{WE_SENT_CODE_TEXT}</BodyText>
                    <BodyText color={colors.white} fontSize={14} fontWeight={'bold'} textAlign="center" >{params?.email}</BodyText>
                </View>
            </View>
            <PINcode code={code} codeLength={CODE_LENGTH} setCode={setCode} />
            <ButtonGradient
                disabled={code.length !== CODE_LENGTH}
                loading={loading}
                title={VERIFY_TEXT}
                buttonStyles={positionHelpers.mh20}
                onPress={handleVerify}
            />
        </SafeAreaView>
    );
};

export default VerifyEmailScreen;
