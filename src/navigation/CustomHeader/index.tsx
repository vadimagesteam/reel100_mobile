import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, positionHelpers } from '../../styles';
import { BodyText, SvgIcon } from '../../components/UI';
import { cs } from './styles';

interface CustomHeaderProps {
    title: string;
    showBackArrow?: boolean;
    showBackArrowPress?: boolean;
    backArrowClick?: () => void;
}

const CustomHeader = ({
    title,
    showBackArrow = false,
    showBackArrowPress = false,
    backArrowClick,
}: CustomHeaderProps) => {
    const navigation = useNavigation();
    const insets = useSafeAreaInsets();

    const paddingInsets = insets.top ? insets.top + 15 : 25;

    return (
        <View
            style={[
                positionHelpers.ph25,
                positionHelpers.rowFillCenter,
                cs.container,
                {
                    paddingTop: paddingInsets,
                },
            ]}>
            <View>
                {!!showBackArrow && (
                    <TouchableOpacity
                        hitSlop={{ left: 8, top: 9, right: 8, bottom: 9 }}
                        onPress={() => navigation.goBack()}>
                        <SvgIcon image="backArrow" />
                    </TouchableOpacity>
                )}
                {!!showBackArrowPress && (
                    <TouchableOpacity
                        hitSlop={{ left: 8, top: 9, right: 8, bottom: 9 }}
                        onPress={backArrowClick}>
                        <SvgIcon image="backArrow" />
                    </TouchableOpacity>
                )}
            </View>
            <BodyText
                fontWeight="500"
                fontSize={18}
                color={colors.white}
                marginLeft={28}>
                {title}
            </BodyText>

            <TouchableOpacity
                disabled={true}
                style={positionHelpers.opacity0}
                hitSlop={{ left: 8, top: 9, right: 8, bottom: 9 }}
                onPress={() => true}>
                <SvgIcon image="backArrow" />
            </TouchableOpacity>
        </View >
    );
};

export default CustomHeader;
