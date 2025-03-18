import React from 'react';

// Components
import {
    View,
    ViewStyle,
    StyleProp,
    TextInput,
    TextInputProps,
    StyleSheet,
    TextStyle,
} from 'react-native';

// Styles & assets
import BodyText from './BodyText';
import ButtonDefault from './ButtonDefault';
import { colors } from '../../styles/colors';
import SvgIcon from './SvgIcon';
import { isIOS } from '../../utils/platformChecker';

interface Props extends TextInputProps {
    containerStyles?: StyleProp<ViewStyle>;
    placeholder?: string;
    placeholderTextColor?: string;
    title?: string;
    titleStyles?: TextStyle;
    inputStyles?: StyleProp<ViewStyle>;
    colorText?: string;
    isSearch?: boolean;
    isClear?: boolean;
    onClear?: () => void;
    focusClearIcon?: boolean;
    isSecurity?: boolean;
    security?: boolean;
    onSecure?: () => void;
    isPhoneNumber?: boolean;
    showRequiredText?: boolean;
    requiredTextColor?: string;
}

const Input: React.FC<Props> = ({
    containerStyles,
    placeholder,
    placeholderTextColor,
    title,
    titleStyles,
    inputStyles,
    colorText,
    // isSearch,
    isPhoneNumber,
    isClear,
    onClear,
    // focusClearIcon,
    isSecurity,
    security,
    onSecure,
    showRequiredText,
    requiredTextColor,
    style,
    ...restProps
}) => {
    return (
        <View>
            <View style={containerStyles}>
                <View style={styles.containerForSecurity}>
                    {!!title && (
                        <BodyText style={[styles.textStyle, titleStyles]}>{title}</BodyText>
                    )}
                </View>
                <TextInput
                    style={[
                        styles.input,
                        inputStyles,
                        style,
                        { color: colorText ? colorText : colors.black },
                    ]}
                    placeholder={placeholder}
                    placeholderTextColor={
                        placeholderTextColor
                            ? placeholderTextColor
                            : colors.silver1Procent50
                    }
                    {...restProps}
                />
                {isSecurity && (
                    <ButtonDefault
                        buttoStyles={styles.securityButton}
                        iconStyles={styles.iconEye}
                        onPress={() => onSecure?.()}>
                        <SvgIcon image={!security ? 'eyeShow' : 'eyeHide'} />
                    </ButtonDefault>
                )}
                {showRequiredText && (
                    <View style={styles.securityButton}>
                        <BodyText
                            fontWeight="300"
                            fontSize={11}
                            color={
                                requiredTextColor ? requiredTextColor : colors.silver1Procent50
                            }>
                            *Required
                        </BodyText>
                    </View>
                )}
            </View>

            {isPhoneNumber && (
                <View style={styles.containerPhoneNumber}>
                    <BodyText fontSize={17}>+3</BodyText>
                    <View style={styles.linePhone} />
                </View>
            )}
            {/* {isSearch && (
        <View style={styles.containerSearchIcon}>
          <Image style={styles.iconSeach} source={icons.search} />
        </View>
      )} */}
            {isClear && (
                <ButtonDefault
                    buttoStyles={styles.containerClearIcon}
                    iconStyles={styles.iconClear}
                    // icon={focusClearIcon ? icons.clear : null}
                    onPress={() => onClear?.()}
                />
            )}
        </View>
    );
};

export default Input;

const styles = StyleSheet.create({
    containerForSecurity: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    textStyle: {
        fontSize: 14,
        marginBottom: 5,
    },
    input: {
        padding: 25,
        backgroundColor: '#fff',
    },
    containerPhoneNumber: {
        height: '100%',
        paddingBottom: 10,
        flexDirection: 'row',
        alignItems: 'flex-end',
        paddingLeft: 3,
        position: 'absolute',
    },
    containerSearchIcon: {
        height: '100%',
        justifyContent: 'center',
        paddingHorizontal: 30,
        position: 'absolute',
    },
    containerClearIcon: {
        height: '100%',
        justifyContent: 'center',
        right: 0,
        paddingHorizontal: 30,
        position: 'absolute',
    },
    iconSeach: {
        height: 15,
        width: 16,
    },
    iconClear: {
        height: 8,
        width: 8,
    },
    iconEye: {
        height: 18,
        width: 25,
    },
    linePhone: {
        backgroundColor: 'rgba(60, 60, 67, 0.29)',
        marginLeft: 5,
        width: 0.5,
        height: 21,
    },
    securityButton: {
        bottom: isIOS() ? 14 : 20,
        right: 10,
        position: 'absolute',
    },
});
