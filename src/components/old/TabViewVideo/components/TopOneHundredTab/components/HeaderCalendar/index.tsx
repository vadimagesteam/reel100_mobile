import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { colors, positionHelpers } from '../../../../../../../styles';
import { BodyText, SvgIcon } from '../../../../../UI';
import { cs } from './styles.ts';

interface HeaderCalendarProps {
    markerDate: string;
    onCalendar: () => void
    openMenu: () => void
    showMenu: boolean;
}

const HeaderCalendar = ({ markerDate, onCalendar, openMenu, showMenu }: HeaderCalendarProps) => {
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
                    <BodyText>{'kvkv eee'}</BodyText>
                </View>

            </TouchableOpacity>
            {showMenu && (<TouchableOpacity style={cs.ml5} onPress={openMenu}>
                <SvgIcon image="menu" />
            </TouchableOpacity>)}

        </View>
    );
};

export default HeaderCalendar;
