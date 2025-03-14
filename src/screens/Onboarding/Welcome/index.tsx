import React from 'react';
import { SafeAreaView, View } from 'react-native';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import { colors, positionHelpers } from '../../../styles';
import { cs } from './styles';
import { BodyText, ButtonDefault } from '../../../components/UI';
import { ONBOARDING_ROUTES, OnboardingRoutes } from '../../../navigation/routes';

const WelcomeScreen = () => {
    const navigation = useNavigation<NavigationProp<OnboardingRoutes>>();

    return (
        <SafeAreaView style={[positionHelpers.fill, { backgroundColor: colors.black4 }]} >
            <View style={[positionHelpers.fill, positionHelpers.justifyCenter, cs.mh30]}>
                <BodyText color={colors.white} fontSize={40} fontWeight={'bold'} textAlign="center" marginBottom={25}>Welcome</BodyText>
                <View>
                    <ButtonDefault onPress={() => navigation.navigate(ONBOARDING_ROUTES.SIGNUP_SCREEN)}>
                        <LinearGradient
                            start={{ x: 0.1, y: 0.5 }}
                            end={{ x: 0.9, y: 0 }}
                            colors={[colors.blue1, colors.blue]}
                            style={positionHelpers.br5}
                        >
                            <BodyText fontSize={18} fontWeight={'bold'} color={colors.white} textAlign="center" margin={15}>Sign up</BodyText>
                        </LinearGradient>
                    </ButtonDefault>
                    <ButtonDefault
                        buttoStyles={[positionHelpers.buttonBorderStyle, positionHelpers.mt15]}
                        onPress={() => navigation.navigate(ONBOARDING_ROUTES.LOGIN_SCREEN)}
                    >
                        <BodyText fontSize={18} fontWeight={'bold'} color={colors.white} textAlign="center" margin={15}>Sign in</BodyText>
                    </ButtonDefault>
                </View>
            </View>
        </SafeAreaView>
    );
};

export default WelcomeScreen;
