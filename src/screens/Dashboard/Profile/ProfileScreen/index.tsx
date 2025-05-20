import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, SafeAreaView, TouchableOpacity, Keyboard, FlatList, Dimensions, RefreshControl } from 'react-native';
import { Easing, useSharedValue, withTiming } from 'react-native-reanimated';
import { colors, positionHelpers } from '../../../../styles';
import CustomHeader from '../../../../components/navigator/CustomHeader';
import { useNavigation } from '@react-navigation/native';
import { DASHBOARD_ROUTES } from '../../../../navigation/routes';
import { BodyText, ButtonDefault, Input, SvgIcon } from '../../../../components/UI';
import ProfileInfo from './components/ProfileInfo';
import { cs } from './styles';
import { RootState, useReduxDispatch, useReduxSelector } from '../../../../store/store';
import { getVideosMeAction } from '../../../../redux/CameraRedux/cameraActions';
import { VideoItemType } from '../../FourU/FourUScreen/types';
import MenuModal from '../../../../components/Modals/MemuModal';
import VideoItem from '../../../../components/VideoItem';
import { setMenuModal, setVideoModal } from '../../../../redux/ModalsRedux/modalSlice';
import { getOneVideoAction } from '../../../../redux/VideoRedux/videoAction';
import FullVideoModal from '../../../../components/Modals/FullVideoModal';
import SearchAnimatedModal from '../../../../components/Modals/SearchAnimatedModal';

const SCREEN_WIDTH = Dimensions.get('window').width;
const ITEM_MARGIN = 4;
const NUM_COLUMNS = 3;
const ITEM_SIZE = (SCREEN_WIDTH - ITEM_MARGIN * (NUM_COLUMNS + 1) - 32) / NUM_COLUMNS;

const ProfileScreen = () => {
    const navigation = useNavigation<any>();
    const dispatch = useReduxDispatch();
    const { videosMeData } = useReduxSelector((state: RootState) => state.camera);
    const { user } = useReduxSelector((state: RootState) => state.auth);
    const { usersData } = useReduxSelector((state: RootState) => state.users);
    const inputRef = useRef(null);
    const [refreshing, setRefreshing] = useState(false);

    //for SearchAnimatedModal
    const [isSearchActive, setIsSearchActive] = useState(false);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [inputY, setInputY] = useState<number>(0);
    const overlayOpacity = useSharedValue(0);
    const overlayTranslateY = useSharedValue(0);
    //

    useEffect(() => {
        dispatch(getVideosMeAction(user?.id));
    }, []);

    useEffect(() => {
        if (isSearchActive && inputRef.current) {
            setTimeout(() => {
                inputRef.current.measure((x, y, width, height, pageX, pageY) => {
                    setInputY(pageY + height);
                });
            }, 100);
        }
    }, [isSearchActive]);

    useEffect(() => {
        if (isSearchActive) {
            overlayOpacity.value = withTiming(1, { duration: 300, easing: Easing.out(Easing.ease) });
            overlayTranslateY.value = withTiming(0, { duration: 300, easing: Easing.out(Easing.ease) });
        } else {
            overlayOpacity.value = withTiming(0, { duration: 200, easing: Easing.in(Easing.ease) });
            overlayTranslateY.value = withTiming(20, { duration: 200, easing: Easing.in(Easing.ease) });
        }
    }, [isSearchActive]);

    const filteredVideos = videosMeData.filter(v => v?.file?.storagePath);

    const handleRefresh = async () => {
        setRefreshing(true);

        setTimeout(async () => {
            await dispatch(getVideosMeAction(user?.id));

            setRefreshing(false);
        }, 1000);
    };


    const renderVideoItem = useCallback(({ item, index }: { item: VideoItemType; index: number }) => {
        const isLastInRow = (index + 1) % NUM_COLUMNS === 0;
        const screenshot =
            item.file?.variation?.[0]?.screenshots?.[0] ?? null;
        return (
            <VideoItem
                key={item?.id}
                item={item}
                user={user}
                screenshot={screenshot}
                isLastInRow={isLastInRow}
                ITEM_SIZE={ITEM_SIZE}
                onVideoPress={() => {
                    dispatch(getOneVideoAction(item?.id));
                    dispatch(setVideoModal(true));
                }}
            />
        );
    }, []);

    return (
        <>
            <View style={positionHelpers.fill}>
                {!isSearchActive && <CustomHeader title="00:00:00" />}
                <SafeAreaView
                    style={[
                        positionHelpers.fill,
                        isSearchActive ? {} : positionHelpers.mb25,
                        {
                            backgroundColor: colors.black4,
                            marginBottom: isSearchActive ? 0 : 70,
                        },
                    ]}
                >
                    <View style={[positionHelpers.ph16, positionHelpers.mb10]}>
                        <View style={[positionHelpers.mt10, positionHelpers.alignItemsCenterRow]}>
                            {isSearchActive && (< TouchableOpacity style={{ marginRight: 15 }} onPress={() => {
                                setIsSearchActive(false);
                                Keyboard.dismiss();
                                setSearchQuery('');
                            }}>
                                <SvgIcon image="backArrow" />
                            </TouchableOpacity>)}
                            <View style={positionHelpers.fill}>
                                <Input
                                    ref={inputRef}
                                    inputStyles={cs.input}
                                    placeholder="Search by user"
                                    onFocus={() => setIsSearchActive(true)}
                                    onChangeText={setSearchQuery}
                                    value={searchQuery}
                                    colorText={colors.white}
                                />
                            </View>
                            {!isSearchActive && (
                                <TouchableOpacity style={{ marginLeft: 15 }} onPress={() => dispatch(setMenuModal(true))}>
                                    <SvgIcon image="menu" />
                                </TouchableOpacity>
                            )}
                        </View>

                        <ProfileInfo fullName={`${user?.firstName} ${user?.lastName}`} />

                        <ButtonDefault
                            buttoStyles={[
                                positionHelpers.mt15,
                                positionHelpers.alignCenter,
                                cs.uploadVideoButton,
                            ]}
                            onPress={() => navigation.navigate(DASHBOARD_ROUTES.VIDEO_RECORD_SCREEN)}
                        >
                            <BodyText fontWeight="bold" fontSize={16} color={colors.blue3}>
                                Upload & Share
                            </BodyText>
                        </ButtonDefault>
                    </View>

                    {filteredVideos.length === 0 ? (
                        <View style={positionHelpers.fillCenter}>
                            <BodyText color={colors.white}>{'No video found'}</BodyText>
                        </View>
                    ) : (
                        <FlatList
                            data={filteredVideos}
                            keyExtractor={(item) => item.id}
                            numColumns={NUM_COLUMNS}
                            // refreshing={refreshing}
                            // onRefresh={handleRefresh}
                            renderItem={renderVideoItem}
                            contentContainerStyle={{
                                paddingHorizontal: 16,
                                paddingBottom: 10,
                            }}
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
                        // onEndReached={handleLoadMore}
                        // onEndReachedThreshold={0.5}
                        // ListFooterComponent={loadingMoreVideo ? <ActivityIndicator color="#fff" /> : null}
                        />
                    )}
                </SafeAreaView >
            </View >
            {isSearchActive && (
                <SearchAnimatedModal
                    usersData={usersData}
                    searchQuery={searchQuery}
                    inputY={inputY}
                    overlayOpacity={overlayOpacity}
                    overlayTranslateY={overlayTranslateY}
                />
            )}

            {/* Video Full Modal */}
            <FullVideoModal
                onArrowPress={() => dispatch(setVideoModal(false))}
            />

            {/* MenuModal */}
            <MenuModal onVisible={() => dispatch(setMenuModal(false))} />
        </>
    );
};

export default ProfileScreen;
