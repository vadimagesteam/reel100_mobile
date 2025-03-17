import React from 'react';
import { SafeAreaView, View } from 'react-native';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { colors, positionHelpers } from '../../../styles';
import { cs } from './styles';
import { BodyText, ButtonDefault } from '../../../components/UI';
import { ONBOARDING_ROUTES, OnboardingRoutes } from '../../../navigation/routes';
import ButtonGradient from '../../../components/ButtonGradient';

const WELCOME_TEXT = 'Welcome';
const SIGNUP_TEXT = 'Sign up';
const SIGNIN_TEXT = 'Sign in';


const WelcomeScreen = () => {
    const navigation = useNavigation<NavigationProp<OnboardingRoutes>>();

    return (
        <SafeAreaView style={[positionHelpers.fill, { backgroundColor: colors.black4 }]} >
            <View style={[positionHelpers.fill, positionHelpers.justifyCenter, cs.mh30]}>
                <BodyText color={colors.white} fontSize={40} fontWeight={'bold'} textAlign="center" marginBottom={25}>{WELCOME_TEXT}</BodyText>
                <View>
                    <ButtonGradient title={SIGNUP_TEXT} onPress={() => navigation.navigate(ONBOARDING_ROUTES.SIGNUP_SCREEN)} />
                    <ButtonDefault
                        buttoStyles={[positionHelpers.buttonBorderStyle, positionHelpers.mt15]}
                        onPress={() => navigation.navigate(ONBOARDING_ROUTES.LOGIN_SCREEN)}
                    >
                        <BodyText fontSize={18} fontWeight={'bold'} color={colors.white} textAlign="center" margin={15}>{SIGNIN_TEXT}</BodyText>
                    </ButtonDefault>
                </View>
            </View>
        </SafeAreaView>
    );
};

export default WelcomeScreen;
