import React from 'react';
import { View, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { colors, positionHelpers } from '../../../../styles';
import CustomHeader from '../../../../components/navigator/CustomHeader';
import { useNavigation } from '@react-navigation/native';
import { DASHBOARD_ROUTES } from '../../../../navigation/routes';
import { BodyText, ButtonDefault, Input, SvgIcon } from '../../../../components/UI';
import ProfileInfo from './components/ProfileInfo';
import { cs } from './styles';


const ProfileScreen = () => {
    const navigation = useNavigation<any>();
    return (
        <>
            <CustomHeader title="00:00:00" />
            <SafeAreaView style={[positionHelpers.fill, { backgroundColor: colors.black4 }]} >
                <ScrollView contentContainerStyle={[positionHelpers.ph16]}>
                    <View style={[positionHelpers.mt10, positionHelpers.alignItemsCenterRow]}>
                        <View style={positionHelpers.fill}>
                            <Input
                                inputStyles={cs.input}
                                placeholder="Search by user"
                            />
                        </View>
                        <TouchableOpacity
                            onPress={() => true}
                        >
                            <SvgIcon image="menu" />
                        </TouchableOpacity>
                    </View>

                    <ProfileInfo />

                    <ButtonDefault buttoStyles={[positionHelpers.mt15, positionHelpers.alignCenter, { backgroundColor: colors.white1, padding: 16, borderRadius: 10 }]} onPress={() => navigation.navigate(DASHBOARD_ROUTES.VIDEO_RECORD_SCREEN)}>
                        <BodyText fontWeight={'bold'} fontSize={16} color={colors.blue3} >Upload & Share</BodyText>
                    </ButtonDefault>
                </ScrollView>
            </SafeAreaView>
        </>
    );
};

export default ProfileScreen;
