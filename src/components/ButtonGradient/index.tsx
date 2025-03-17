import React from 'react';
import { BodyText, ButtonDefault } from '../UI';
import { colors, positionHelpers } from '../../styles';
import LinearGradient from 'react-native-linear-gradient';
import { StyleProp, ViewStyle } from 'react-native';

interface ButtonGradientProps {
    title: string
    disabled?: boolean
    buttonStyles?: StyleProp<ViewStyle>,
    onPress: () => void
}

const ButtonGradient = ({ title, disabled, buttonStyles, onPress }: ButtonGradientProps) => {
    return (
        <ButtonDefault
            disabled={disabled}
            buttoStyles={[positionHelpers.mb10, positionHelpers.pt10, buttonStyles]}
            onPress={onPress}>
            <LinearGradient
                start={{ x: 0.1, y: 0.5 }}
                end={{ x: 0.9, y: 0 }}
                colors={[colors.blue1, colors.blue]}
                style={positionHelpers.br5}
            >
                <BodyText fontSize={18} fontWeight={'bold'} color={colors.white} textAlign="center" margin={15}>{title}</BodyText>
            </LinearGradient>
        </ButtonDefault>
    );
};

export default ButtonGradient;
