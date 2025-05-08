import React, { useState } from 'react';
import { Image, Modal, TouchableOpacity, View } from 'react-native';
import { BodyText, SvgIcon } from '../../UI';
import { colors, positionHelpers } from '../../../styles';
import { useReduxDispatch, useReduxSelector } from '../../../store/store';
import { onLogout } from '../../../redux/AuthRedux/authSlice';
import { useNavigation } from '@react-navigation/native';
import { DASHBOARD_ROUTES } from '../../../navigation/routes';

interface MenuModalProps {
    visible: boolean,
    onVisible: (val: boolean) => void
}

const MenuModal = ({ visible, onVisible }: MenuModalProps) => {
    const navigation = useNavigation();
    const dispatch = useReduxDispatch();
    const { user } = useReduxSelector(state => state?.auth);

    return (
        <Modal
            animationType="fade"
            transparent={false}
            visible={visible}
            onRequestClose={onVisible}
        >
            <View style={[positionHelpers.fill, {
                backgroundColor: colors.black1,
                justifyContent: 'flex-start',
            }]}>
                <TouchableOpacity onPress={onVisible} style={{
                    marginTop: 100,
                    paddingHorizontal: 20,
                }}>
                    <SvgIcon image="backArrow" />
                </TouchableOpacity>
                <View style={[positionHelpers.alignItemsCenterRow, positionHelpers.mt30, {
                    borderBottomWidth: 0.5,
                    borderBottomColor: colors.silver6,
                    paddingHorizontal: 20,
                    paddingBottom: 20,
                }]}>
                    <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/512/9203/9203764.png' }} style={{ height: 60, width: 60 }} />
                    <BodyText fontWeight={'bold'} fontSize={20} color={colors.white} paddingLeft={10}>{user?.firstName} {user?.lastName}</BodyText>
                </View>
                <View style={{ paddingHorizontal: 20 }}>
                    <TouchableOpacity style={[positionHelpers.alignItemsCenterRow, positionHelpers.mt30]} onPress={() => {
                        onVisible(false);
                        navigation.navigate(DASHBOARD_ROUTES.MAIN_TAB);
                    }}>
                        <SvgIcon color={colors.silver6} image="homeNavTab" />
                        <BodyText fontSize={18} color={colors.silver6} marginLeft={10}>Home</BodyText>
                    </TouchableOpacity>
                    <TouchableOpacity style={[positionHelpers.alignItemsCenterRow, positionHelpers.mt30]} onPress={() => dispatch(onLogout())}>
                        <SvgIcon image="logoutIcon" />
                        <BodyText fontSize={18} color={colors.silver6} marginLeft={10}>Logout</BodyText>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

export default MenuModal;
