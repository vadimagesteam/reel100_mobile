import React from 'react';

// Components
import {
    View,
    ViewStyle,
    TouchableOpacity,
    Image,
    ImageSourcePropType,
    TextStyle,
    ImageStyle,
    Insets,
    TouchableOpacityProps,
    StyleProp,
    ActivityIndicator,
    StyleSheet,
    Text,
} from 'react-native';

interface Props extends TouchableOpacityProps {
    activeOpacity?: number;
    title?: string;
    hitSlop?: Insets | undefined;
    buttoStyles?: StyleProp<ViewStyle>;
    icon?: ImageSourcePropType;
    iconStyles?: ImageStyle;
    textStyles?: TextStyle;
    onPress: () => void;
    blocChildren?: boolean;
    blocChildrenStyle?: ViewStyle;
    loading?: boolean;
    colorIndicator?: string;
}

const ButtonDefault: React.FC<Props> = ({
    title,
    buttoStyles,
    icon,
    iconStyles,
    textStyles,
    onPress,
    blocChildren,
    blocChildrenStyle,
    loading,
    colorIndicator,
    children,
    ...restProps
}) => {
    return (
        <TouchableOpacity
            style={buttoStyles}
            onPress={() => onPress()}
            {...restProps}>
            {loading ? (
                <ActivityIndicator
                    size="small"
                    color={colorIndicator ? colorIndicator : '#fff'}
                />
            ) : (
                <>
                    {children}
                    {!!title && (
                        <Text style={[styles.textCol, textStyles]} >
                            {title}
                        </Text>
                    )}

                    {!!icon && <Image source={icon} style={iconStyles} />}

                    {!!blocChildren && <View style={blocChildrenStyle} />}
                </>
            )}
        </TouchableOpacity>
    );
};

export default ButtonDefault;

const styles = StyleSheet.create({
    textCol: {
        fontStyle: 'normal',
        fontSize: 22,
        color: '#fff',
    },
});
