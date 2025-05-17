import React, { useRef, useState } from 'react';
import { Animated, Dimensions, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { cs } from './styles';
import { colors, positionHelpers } from '../../../styles';
import { BodyText, SvgIcon } from '../../UI';
import CountdownClockHeader from '../../CountdownClock';
import DropdownMenu from '../../DropdownMenu';


const { width } = Dimensions.get('window');

interface CustomHeaderProps {
    title: string;
    showBackArrow?: boolean;
    showBackArrowPress?: boolean;
    showAnimationHeader?: boolean
    backArrowClick?: () => void;

    dataStates?: any[]
    onMenuPress?: () => void
}

const CustomHeader = ({
    title,
    showBackArrow = false,
    showBackArrowPress = false,
    showAnimationHeader = false,
    backArrowClick,

    dataStates,
    onMenuPress,
}: CustomHeaderProps) => {
    const navigation = useNavigation();
    const insets = useSafeAreaInsets();

    const paddingInsets = insets.top ? insets.top + 8 : 17;

    const [expanded, setExpanded] = useState(false);
    const animWidth = useRef(new Animated.Value(50)).current; // initial square size
    const animOpacity = useRef(new Animated.Value(1)).current; // for hiding the title

    const toggleExpand = () => {
        if (expanded) {
            Animated.parallel([
                Animated.timing(animWidth, {
                    toValue: 50,
                    duration: 300,
                    useNativeDriver: false,
                }),
                Animated.timing(animOpacity, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
            ]).start(() => setExpanded(false));
        } else {
            setExpanded(true);
            Animated.parallel([
                Animated.timing(animWidth, {
                    toValue: width * 0.80,
                    duration: 300,
                    useNativeDriver: false,
                }),
                Animated.timing(animOpacity, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                }),
            ]).start();
        }
    };

    return (
        <>
            {
                showAnimationHeader ? (
                    <View
                        style={[
                            positionHelpers.ph20,
                            positionHelpers.rowFillCenter,
                            cs.container,
                            {
                                paddingTop: paddingInsets,
                            },
                        ]}>

                        {/* <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, marginTop: 10, height: 50 }}> */}
                        {/* LEFT: expanding Dropdown */}
                        <TouchableOpacity onPress={toggleExpand}>
                            <Animated.View style={{
                                width: animWidth,
                                height: 40,
                                // padding: 11,
                                // backgroundColor: '#444',
                                borderRadius: 8,
                                justifyContent: 'center',
                                // position: 'absolute',
                                // paddingHorizontal: 10,
                            }}>
                                {expanded ? (
                                    <DropdownMenu
                                        data={dataStates}
                                        selectedValue={''}
                                        onSelect={() => true}
                                        placeholder="Change Country"
                                    />
                                ) : <View style={{ marginBottom: 5 }}>
                                    <SvgIcon image="location" color={colors.white} />
                                </View>}
                            </Animated.View>
                        </TouchableOpacity>

                        {/* CENTER: CountdownClockHeader */}
                        <Animated.View
                            style={{
                                position: 'absolute',
                                top: 75,
                                left: 0,
                                right: 0,
                                alignItems: 'center',
                                opacity: animOpacity,
                                // backgroundColor: 'red',
                                zIndex: 0,
                            }}
                            pointerEvents="none"
                        >
                            <CountdownClockHeader />
                        </Animated.View>

                        {/* RIGHT: Menu icon */}
                        {expanded ? (
                            <TouchableOpacity style={{ marginLeft: 6 }} onPress={toggleExpand}>
                                <BodyText fontWeight={'600'} color={colors.white}>Close</BodyText>
                            </TouchableOpacity>
                        ) : (
                            <TouchableOpacity
                                onPress={onMenuPress}
                            >
                                <SvgIcon image="menu" />
                            </TouchableOpacity>
                        )}
                    </View >
                ) : (
                    <View
                        style={[
                            positionHelpers.ph25,
                            positionHelpers.rowFillCenter,
                            cs.container,
                            {
                                paddingTop: paddingInsets,
                            },
                        ]}>
                        <View>
                            {!!showBackArrow && (
                                <TouchableOpacity
                                    hitSlop={{ left: 8, top: 9, right: 8, bottom: 9 }}
                                    onPress={() => navigation.goBack()}>
                                    <SvgIcon image="backArrow" />
                                </TouchableOpacity>
                            )}
                            {!!showBackArrowPress && (
                                <TouchableOpacity
                                    hitSlop={{ left: 8, top: 9, right: 8, bottom: 9 }}
                                    onPress={backArrowClick}>
                                    <SvgIcon image="backArrow" />
                                </TouchableOpacity>
                            )}
                        </View>
                        {/* <BodyText
                fontWeight="500"
                fontSize={18}
                color={colors.white}
                marginLeft={28}>
                {title}
            </BodyText> */}
                        <CountdownClockHeader />

                        <TouchableOpacity
                            disabled={true}
                            style={positionHelpers.opacity0}
                            hitSlop={{ left: 8, top: 9, right: 8, bottom: 9 }}
                            onPress={() => true}>
                            <SvgIcon image="backArrow" />
                        </TouchableOpacity>
                    </View >
                )
            }
        </>
    );
};

export default CustomHeader;
