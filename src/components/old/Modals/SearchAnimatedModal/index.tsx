/*
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
    Modal,
    StyleSheet,
    TouchableOpacity,
    View,
    FlatList,
    Pressable,
    KeyboardAvoidingView,
    Platform,
    Keyboard,
    SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { BodyText, Input, SvgIcon } from '../../UI';
import { colors, positionHelpers } from '../../../../styles';
import { DASHBOARD_ROUTES } from '../../../../navigation/routes.ts';
import { debounce } from '../../../../utils/debounce.ts';
import { RootState, useReduxDispatch, useReduxSelector } from '../../../../store/store.ts';
import { getOneUserAction, getUsersAction } from '../../../../redux/UsersRedux/usersAction.tsx';
import { setIsSearchActive } from '../../../../redux/ModalsRedux/modalSlice.ts';
import EmptyContent from '../../EmptyContent';


const SearchAnimatedModal = () => {
    const { isSearchActive } = useReduxSelector((state: RootState) => state.modals);
    const { usersData } = useReduxSelector((state: RootState) => state.users);
    const navigation = useNavigation<any>();
    const dispatch = useReduxDispatch();
    const [query, setQuery] = useState('');

    const inputRef = useRef<any>(null);

    const debouncedSearch = useRef(
        debounce((text: string) => {
            dispatch(getUsersAction(text));
        }, 350)
    ).current;

    useEffect(() => {
        if (query.trim()) {
            debouncedSearch(query);
        }
    }, [query]);

    const filteredUsers = usersData?.filter(
        (item) => item?.firstName?.trim() && item?.lastName?.trim()
    );

    const renderUser = useCallback(({ item }: { item: any }) => {
        return (
            <TouchableOpacity
                onPress={() => {
                    dispatch(getOneUserAction(item?.id));
                    dispatch(setIsSearchActive(false));
                    navigation.navigate(DASHBOARD_ROUTES.USER_PROFILE_SCREEN, { idUser: item?.id });
                    setQuery('');
                }}
            >
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
    }, []);

    return (
        <Modal
            animationType="fade"
            transparent
            visible={isSearchActive}
            onRequestClose={() => dispatch(setIsSearchActive(false))}
        >
            <Pressable
                style={[positionHelpers.fill, cs.overlay]}
                onPress={() => {
                    Keyboard.dismiss();
                    dispatch(setIsSearchActive(false));
                }}
            >
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                    style={positionHelpers.fill}
                >
                    <Pressable style={cs.inner} onPress={() => { }}>
                        <SafeAreaView>
                            {/!* Input Field *!/}
                            <View style={[positionHelpers.alignItemsCenterRow, cs.inputWrapper]}>
                                <TouchableOpacity
                                    style={cs.iconButton}
                                    onPress={() => {
                                        dispatch(setIsSearchActive(false));
                                        setQuery('');
                                        Keyboard.dismiss();
                                    }}
                                >
                                    <SvgIcon image="backArrow" />
                                </TouchableOpacity>

                                <View style={positionHelpers.fill}>
                                    <Input
                                        ref={inputRef}
                                        placeholder="Search by user"
                                        value={query}
                                        onChangeText={setQuery}
                                        inputStyles={cs.input}
                                        autoFocus
                                        colorText={colors.white}
                                    />
                                </View>
                            </View>

                            {/!* Results List *!/}
                            {query ? (
                                <FlatList
                                    data={filteredUsers}
                                    keyExtractor={(item) => item.id}
                                    renderItem={renderUser}
                                    ListEmptyComponent={() => <EmptyContent text="No results found" />}
                                    contentContainerStyle={cs.listContainer}
                                    keyboardShouldPersistTaps="handled"
                                />
                            ) : (
                                <View style={positionHelpers.fillCenter}>
                                    <BodyText color={colors.white}>Start typing to search</BodyText>
                                </View>
                            )}
                        </SafeAreaView>
                    </Pressable>
                </KeyboardAvoidingView>
            </Pressable>
        </Modal>
    );
};

const cs = StyleSheet.create({
    overlay: {
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'flex-start',
    },
    inner: {
        flex: 1,
        backgroundColor: colors.black4,
        paddingHorizontal: 16,
        paddingTop: 20,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        marginTop: 10,
    },
    iconButton: {
        marginRight: 10,
    },
    input: {
        padding: 10,
        backgroundColor: '#1b1b1b',
        borderRadius: 8,
    },
    listContainer: {
        paddingBottom: 20,
        flexGrow: 1,
    },
});

export default SearchAnimatedModal;
*/
