import React from 'react';
import { View } from 'react-native';
import { BodyText } from '../UI';
import { colors, positionHelpers } from '../../styles';

interface EmptyContentProps {
    text?: string
}

const EmptyContent = ({ text }: EmptyContentProps) => {
    return (
        <View style={positionHelpers.fillCenter}>
            <BodyText color={colors.white}>{text ? text : 'No video found'}</BodyText>
        </View>
    );
};

export default EmptyContent;
