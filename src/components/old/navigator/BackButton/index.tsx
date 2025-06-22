import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { ButtonDefault, SvgIcon } from '../../UI';
import { cs } from './styles.ts';

interface BackButtonProps {
    buttonStyle?: StyleProp<ViewStyle>
    onPress: () => void
}

const BackButton = ({ buttonStyle, onPress }: BackButtonProps) => {
    return (
        <ButtonDefault buttoStyles={[cs.backArrow, buttonStyle]} onPress={onPress}>
            <SvgIcon image="backArrow" />
        </ButtonDefault>
    );
};

export default BackButton;
