import React, { useCallback, useMemo, useRef } from 'react';
import { TextInput, TouchableOpacity, View } from 'react-native';
import { BodyText, Input } from '../UI';
import { cs } from './styles';
import { positionHelpers } from '../../styles';

interface PINcodeProps {
    code: string,
    codeLength: number
    setCode: (val: string) => void
}

const PINcode = ({ code, codeLength, setCode }: PINcodeProps) => {
    const inputRef = useRef<TextInput>(null);

    const handlePress = useCallback(() => {
        inputRef.current?.focus();
    }, []);

    const codeSquares = useMemo(() => (
        Array.from({ length: codeLength }).map((_, index) => (
            <View key={index} style={[positionHelpers.center, cs.containerSquare]}>
                <BodyText fontSize={24} fontWeight={'bold'}>{code[index] || ''}</BodyText>
            </View>
        ))
    ), [code, codeLength]);

    return (
        <>
            <Input
                ref={inputRef}
                style={cs.inputStyle}
                keyboardType="numeric"
                maxLength={codeLength}
                value={code}
                onChangeText={setCode}
                autoFocus
            />
            <TouchableOpacity
                activeOpacity={0.9}
                style={[positionHelpers.justifyCenterRow, positionHelpers.mb20]}
                onPress={handlePress}
            >
                {codeSquares}
            </TouchableOpacity>
        </>
    );
};

export default PINcode;
