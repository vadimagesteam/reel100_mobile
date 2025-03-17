import React from 'react';
import { } from 'react-native';
import { ButtonDefault, SvgIcon } from '../../UI';
import { cs } from './styles';

interface BackButtonProps {
    onPress: () => void
}

const BackButton = ({ onPress }: BackButtonProps) => {
    return (
        <ButtonDefault buttoStyles={cs.backArrow} onPress={onPress}>
            <SvgIcon image="backArrow" />
        </ButtonDefault>
    );
};

export default BackButton;
