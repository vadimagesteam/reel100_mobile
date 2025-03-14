import React, { ReactNode } from 'react';
import {
    Keyboard,
    TouchableWithoutFeedback,
    ViewStyle,
    SafeAreaView,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { positionHelpers } from '../../styles';

interface Props {
    containerStyles?: ViewStyle | ViewStyle[];
    children?: ReactNode;
}

const FormContainer: React.FC<Props> = ({ containerStyles = [], children }) => {
    return (
        <SafeAreaView style={[positionHelpers.fill, containerStyles]}>
            <KeyboardAwareScrollView
                style={positionHelpers.fill}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="always"
                enableResetScrollToCoords={false}>
                <TouchableWithoutFeedback
                    activeOpacity={1}
                    onPress={Keyboard.dismiss}
                    style={positionHelpers.fill}>
                    {children}
                </TouchableWithoutFeedback>
            </KeyboardAwareScrollView>
        </SafeAreaView>
    );
};

export default FormContainer;
