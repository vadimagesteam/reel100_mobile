import React from 'react';
import { FlatList, Image, SafeAreaView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useReduxDispatch } from '../../../../store/store';
import { ChatPreview } from './types';
import { BodyText, SvgIcon } from '../../../../components/UI';
import { colors, positionHelpers } from '../../../../styles';
import CustomHeader from '../../../../components/navigator/CustomHeader';
import { setIsSearchActive, setMenuModal } from '../../../../redux/ModalsRedux/modalSlice';
import { mockChatList } from './mockData';
import SearchAnimatedModal from '../../../../components/Modals/SearchAnimatedModal';
import MenuModal from '../../../../components/Modals/MemuModal';
import { DASHBOARD_ROUTES } from '../../../../navigation/routes';


const ChatListScreen = () => {
    const navigation = useNavigation<any>();
    const dispatch = useReduxDispatch();

    const renderItem = ({ item }: { item: ChatPreview }) => {
        return (
            <TouchableOpacity
                style={cs.itemContainer}
                onPress={() => true}
            // onPress={() => navigation.navigate(DASHBOARD_ROUTES.CHAT_SCREEN, { chatId: item.id })}
            >
                {item.avatar !== '' ? <Image source={{ uri: item.avatar }} style={cs.avatar} /> : <View style={{ height: 50, width: 50, borderRadius: '80%', backgroundColor: 'silver' }} />}
                <View style={cs.textContainer}>
                    <View style={cs.row}>
                        <BodyText fontWeight={'bold'} fontSize={16} color={colors.white} marginLeft={5}>{item.name}</BodyText>
                        <BodyText fontSize={12} color={colors.silver2}>{formatTime(item.timestamp)}</BodyText>
                    </View>
                    <View style={cs.row}>
                        <BodyText fontSize={14} flex={1} color={colors.silver2} marginTop={2} marginLeft={5} numberOfLines={1}>
                            {item.lastMessage}
                        </BodyText>
                        {item.unreadCount ? (
                            <View style={cs.unreadBadge}>
                                <BodyText fontSize={12} color={colors.white}>{item.unreadCount}</BodyText>
                            </View>
                        ) : null}
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    const formatTime = (timestamp: string) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <>
            <View style={positionHelpers.fill}>
                <CustomHeader title="00:00:00" showBackArrow />
                <SafeAreaView
                    style={[
                        positionHelpers.fill,
                        {
                            backgroundColor: colors.black4,
                        },
                    ]}
                >
                    <View style={[positionHelpers.ph16, positionHelpers.mb10]}>
                        <View style={[positionHelpers.mt10, positionHelpers.alignItemsCenterRow]}>
                            <View style={positionHelpers.fill}>
                                <TouchableOpacity style={cs.input} onPress={() => dispatch(setIsSearchActive(true))}>
                                    <BodyText color={colors.silver1Procent50}>Search by user</BodyText>
                                </TouchableOpacity>
                            </View>
                            <TouchableOpacity style={cs.ml15} onPress={() => dispatch(setMenuModal(true))}>
                                <SvgIcon image="menu" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <FlatList
                        data={mockChatList}
                        renderItem={renderItem}
                        keyExtractor={(item) => item.id}
                    />

                    {/* {loading && filteredVideos.length === 0 ? (
                        <LoaderIndicator variantTwo />
                    ) :
                        filteredVideos.length === 0 ? (
                            <EmptyContent />
                        ) : (
                            <FlatList
                                data={filteredVideos}
                                keyExtractor={(item) => item.id}
                                numColumns={NUM_COLUMNS}
                                renderItem={renderVideoItem}
                                contentContainerStyle={[positionHelpers.ph16, cs.pb10]}
                                initialNumToRender={6} // менше елементів на старт
                                windowSize={5} // скільки блоків рендериться навколо екрану
                                maxToRenderPerBatch={6}
                                removeClippedSubviews={true} // видаляє елементи за межами екрану
                                refreshControl={
                                    <RefreshControl
                                        refreshing={refreshing}
                                        onRefresh={handleRefresh}
                                        colors={['#fff']} // Android (спінер)
                                        tintColor="#fff" // iOS (спінер)
                                    />
                                }
                                onEndReached={handleLoadMore}
                                onEndReachedThreshold={0.5}
                                ListFooterComponent={loadingMore && hasMore ? <ActivityIndicator color="#fff" /> : null}
                            />
                        )} */}
                </SafeAreaView >
            </View >

            {/* Search Modal */}
            <SearchAnimatedModal />

            {/* MenuModal */}
            <MenuModal onVisible={() => dispatch(setMenuModal(false))} />
        </>
    );
};

export const cs = StyleSheet.create({
    input: {
        padding: 10,
        backgroundColor: '#1b1b1b',
        borderRadius: 8,
    },
    uploadVideoButton: {
        backgroundColor: colors.white1,
        padding: 16,
        borderRadius: 10,
    },
    mr15: {
        marginRight: 15,
    },
    ml15: {
        marginLeft: 15,
    },
    pb10: {
        paddingBottom: 10,
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    itemContainer: {
        flexDirection: 'row',
        marginHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#535159',
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 28,
    },
    textContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    unreadBadge: {
        backgroundColor: '#2e89ff',
        borderRadius: 12,
        paddingHorizontal: 6,
        paddingVertical: 2,
        marginLeft: 6,
    },
    unreadText: {
        color: '#fff',
        fontSize: 12,
    },
});

export default ChatListScreen;
