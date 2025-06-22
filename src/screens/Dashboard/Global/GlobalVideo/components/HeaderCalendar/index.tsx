import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { colors, positionHelpers } from '../../../../../../styles';
import { BodyText, SvgIcon } from '../../../../../../components/old/UI';
import { cs } from './styles';

interface HeaderCalendarProps {
    markerDate: string;
    onCalendar: () => void
    openMenu: () => void
}

const HeaderCalendar = ({ markerDate, onCalendar, openMenu }: HeaderCalendarProps) => {
    return (
        <View style={[positionHelpers.ph16, positionHelpers.mt10, positionHelpers.rowFillCenter]}>
            <TouchableOpacity
                activeOpacity={0.9}
                style={[positionHelpers.rowFillCenter, positionHelpers.fill, cs.container]}
                onPress={onCalendar}
            >
                <View style={[positionHelpers.alignItemsCenterRow]}>
                    <BodyText fontSize={16} color={colors.silver2} paddingLeft={8} paddingTop={2}>
                        {markerDate}
                    </BodyText>
                </View>
                <View>
                    <BodyText>{'kvkv'}</BodyText>
                </View>

            </TouchableOpacity>
            <TouchableOpacity style={cs.ml5} onPress={openMenu}>
                <SvgIcon image="menu" />
            </TouchableOpacity>

        </View>
    );
};

export default HeaderCalendar;
