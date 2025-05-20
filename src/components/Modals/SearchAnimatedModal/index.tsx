import React, { useEffect, useRef } from 'react';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Animated, { SharedValue, useAnimatedStyle } from 'react-native-reanimated';
import { BodyText } from '../../UI';
import { colors, positionHelpers } from '../../../styles';
import { DASHBOARD_ROUTES } from '../../../navigation/routes';
import { debounce } from '../../../utils/debounce';
import { useReduxDispatch } from '../../../store/store';
import { getUsersAction } from '../../../redux/UsersRedux/usersAction';

interface SearchAnimatedModalProps {
    searchQuery: string
    usersData: any[]
    inputY: number,
    overlayOpacity: SharedValue<number>
    overlayTranslateY: SharedValue<number>

}

const SearchAnimatedModal = ({ searchQuery, usersData, inputY, overlayOpacity, overlayTranslateY }: SearchAnimatedModalProps) => {
    const navigation = useNavigation<any>();
    const dispatch = useReduxDispatch();

    const debouncedSearch = useRef(
        debounce((text: string) => {
            dispatch(getUsersAction(text));
        }, 350)
    ).current;

    useEffect(() => {
        if (searchQuery.trim()) {
            debouncedSearch(searchQuery);
        }
    }, [searchQuery]);

    const filteredUsers = usersData?.filter(
        (item) => item?.firstName?.trim() && item?.lastName?.trim()
    );

    const animatedOverlayStyle = useAnimatedStyle(() => ({
        opacity: overlayOpacity.value,
        transform: [{ translateY: overlayTranslateY.value }],
    }));

    return (
        <Animated.View
            style={[
                positionHelpers.ph16,
                {
                    ...StyleSheet.absoluteFillObject,
                    backgroundColor: colors.black4,
                    marginTop: inputY,
                    marginBottom: 70,
                }, animatedOverlayStyle]}
        >
            {searchQuery ? (
                <FlatList
                    data={filteredUsers}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => {
                        return (
                            <TouchableOpacity onPress={() => {
                                navigation.navigate(DASHBOARD_ROUTES.USER_PROFILE_SCREEN, { idUser: item?.id });
                            }}>
                                <BodyText
                                    paddingLeft={10}
                                    fontSize={16}
                                    color={colors.white}
                                    paddingVertical={12}
                                    borderBottomColor={colors.silver1Procent50}
                                    borderBottomWidth={1}
                                >
                                    {item.firstName} {item?.lastName}
                                </BodyText>
                            </TouchableOpacity>
                        );
                    }}
                    ListEmptyComponent={() => {
                        return (
                            <View style={[positionHelpers.fillCenter, positionHelpers.ph20]}>
                                <BodyText color={colors.white} >No results found</BodyText>
                            </View>
                        );
                    }}
                    contentContainerStyle={{ padding: 10, flexGrow: 1 }}
                />
            ) : (
                <View style={positionHelpers.fillCenter}>
                    <BodyText color={colors.white} >No results found</BodyText>
                </View>
            )}
        </Animated.View>
    );
};

export default SearchAnimatedModal;
