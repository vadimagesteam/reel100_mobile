import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, SafeAreaView, TouchableOpacity, ScrollView, Keyboard, FlatList, Dimensions, Image, StyleSheet } from 'react-native';
import FastImage from 'react-native-fast-image';
import { GestureHandlerRootView, HandlerStateChangeEvent, State, TapGestureHandlerEventPayload } from 'react-native-gesture-handler';
import Animated, { Easing, useSharedValue, withSpring, withTiming, runOnJS, useAnimatedStyle } from 'react-native-reanimated';
import { colors, positionHelpers } from '../../../../styles';
import CustomHeader from '../../../../components/navigator/CustomHeader';
import { useNavigation } from '@react-navigation/native';
import { DASHBOARD_ROUTES } from '../../../../navigation/routes';
import { BodyText, ButtonDefault, Input, SvgIcon } from '../../../../components/UI';
import ProfileInfo from './components/ProfileInfo';
import { cs } from './styles';
import { RootState, useReduxDispatch, useReduxSelector } from '../../../../store/store';
import { getUserVideosAction, getVideosAction } from '../../../../redux/CameraRedux/cameraActions';
import Video from 'react-native-video';
import FullVideoModal from '../../../../components/TabViewVideo/components/StateFeedTab/components/FullVideoModal';
import { VideoItemType } from '../../FourU/FourUScreen/types';
import ProfileVideoModal from './components/ProfileVideoModal';
import VideoAbsoluteInfo from '../../../../components/VideoAbsoluteInfo';
import { formatTwoTime } from '../../../../utils/formatTime';
import MenuModal from '../../../../components/Modals/MemuModal';
import { usersData } from './mockData';


const SCREEN_WIDTH = Dimensions.get('window').width;
const ITEM_MARGIN = 4;
const NUM_COLUMNS = 3;
const ITEM_SIZE = (SCREEN_WIDTH - ITEM_MARGIN * (NUM_COLUMNS + 1) - 32) / NUM_COLUMNS;

const ProfileScreen = () => {
    const navigation = useNavigation<any>();
    const dispatch = useReduxDispatch();
    const { userVideos } = useReduxSelector((state: RootState) => state.camera);
    const { user } = useReduxSelector((state: RootState) => state.auth);
    const inputRef = useRef(null);
    const [activeVideoIds, setActiveVideoIds] = useState<string[]>([]);
    const [modalVideo, setModalVideo] = useState<VideoItemType | null>(null);
    const [refreshing, setRefreshing] = useState(false);
    const [isSearchActive, setIsSearchActive] = useState(false);

    const scale = useSharedValue(0);
    const opacity = useSharedValue(1);
    const tapX = useSharedValue(0);
    const tapY = useSharedValue(0);
    const [visible, setVisible] = useState<boolean>(false);
    const [inputY, setInputY] = useState<number>(0);
    const overlayOpacity = useSharedValue(0);
    const overlayTranslateY = useSharedValue(0);
    const [searchQuery, setSearchQuery] = useState<string>('');

    useEffect(() => {
        dispatch(getUserVideosAction(user?.id));
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


    const filteredVideos = userVideos.filter(v => v?.file?.storagePath);

    const handleRefresh = async () => {
        setRefreshing(true);
        try {
            await dispatch(getUserVideosAction(user?.id));
        } finally {
            setRefreshing(false);
        }
    };

    const handleDoubleTap = useCallback(
        (event: HandlerStateChangeEvent<TapGestureHandlerEventPayload>) => {
            if (event.nativeEvent.state === State.END) {
                const { x, y } = event.nativeEvent;

                tapX.value = x;
                tapY.value = y;

                scale.value = 1;
                opacity.value = 1;

                scale.value = withSpring(1.2, { damping: 5, stiffness: 100 }, () => {
                    scale.value = withTiming(0, { duration: 500 });
                    opacity.value = withTiming(0, { duration: 500 });
                });
            }
        },
        [scale, opacity, tapX, tapY]
    );


    const renderVideoItem = ({ item, index }: { item: VideoItemType; index: number }) => {
        const url = item?.file?.storagePath;
        const isLastInRow = (index + 1) % NUM_COLUMNS === 0;
        const screenshot =
            item.file?.variation?.[0]?.screenshots?.[0] ?? null;

        return (
            <TouchableOpacity
                key={item.id}
                style={{
                    width: ITEM_SIZE,
                    height: 150,
                    marginRight: isLastInRow ? 0 : ITEM_MARGIN,
                    marginBottom: ITEM_MARGIN,
                    borderRadius: 8,
                    overflow: 'hidden',
                    backgroundColor: '#000',
                }}
                onPress={() => setModalVideo(item)}
            >
                {/* <Video
                    source={{ uri: url }}
                    style={{ width: '100%', height: '100%' }}
                    resizeMode="cover"
                    repeat
                    muted
                    paused
                    ignoreSilentSwitch="ignore"
                /> */}
                {/* <Image
                    source={{ uri: screenshot }}
                    style={{ width: '100%', height: '100%' }}
                    resizeMode="cover"
                /> */}
                {screenshot ? (
                    <>
                        <FastImage
                            style={{ width: '100%', height: '100%', borderRadius: 5 }}
                            source={{
                                uri: screenshot,
                                priority: FastImage.priority.normal,
                                cache: FastImage.cacheControl.immutable,
                            }}
                            resizeMode={FastImage.resizeMode.cover}
                        />
                        <VideoAbsoluteInfo
                            justInfo="SIMPLE"
                            avatar={''}
                            name={'Name Lastname'}
                            // videoDuration={`${formatTwoTime(duration)}s`}
                            likesCount={item?.like_count}
                        />
                    </>
                ) : (
                    <View
                        style={{
                            width: '100%',
                            height: '100%',
                            backgroundColor: 'black',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: 8,
                        }}
                    >
                        <BodyText fontSize={10} color={colors.white}>No preview</BodyText>
                    </View>
                )}

            </TouchableOpacity>
        );
    };

    const filteredUsers = usersData.filter(user =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const animatedOverlayStyle = useAnimatedStyle(() => ({
        opacity: overlayOpacity.value,
        transform: [{ translateY: overlayTranslateY.value }],
    }));
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
                                />
                            </View>
                            {!isSearchActive && (
                                <TouchableOpacity style={{ marginLeft: 15 }} onPress={() => setVisible(true)}>
                                    <SvgIcon image="menu" />
                                </TouchableOpacity>
                            )}
                        </View>

                        <ProfileInfo fullName={`${user?.firstName} ${user?.lastName}`} />

                        <ButtonDefault
                            buttoStyles={[
                                positionHelpers.mt15,
                                positionHelpers.alignCenter,
                                {
                                    backgroundColor: colors.white1,
                                    padding: 16,
                                    borderRadius: 10,
                                },
                            ]}
                            onPress={() => navigation.navigate(DASHBOARD_ROUTES.VIDEO_RECORD_SCREEN)}
                        >
                            <BodyText fontWeight="bold" fontSize={16} color={colors.blue3}>
                                Upload & Share
                            </BodyText>
                        </ButtonDefault>
                    </View>

                    <FlatList
                        data={filteredVideos.reverse()}
                        keyExtractor={(item) => item.id}
                        numColumns={NUM_COLUMNS}
                        refreshing={refreshing}
                        onRefresh={handleRefresh}
                        renderItem={renderVideoItem}
                        contentContainerStyle={{
                            paddingHorizontal: 16,
                            paddingBottom: 10,
                        }}
                        initialNumToRender={6} // менше елементів на старт
                        windowSize={5} // скільки блоків рендериться навколо екрану
                        maxToRenderPerBatch={6}
                        removeClippedSubviews={true} // видаляє елементи за межами екрану
                    />
                </SafeAreaView >

                {isSearchActive && (

                    <Animated.View
                        style={[
                            {
                                ...StyleSheet.absoluteFillObject,
                                backgroundColor: colors.black4,
                                marginTop: inputY,
                                paddingHorizontal: 16,
                            }, animatedOverlayStyle]}
                    >
                        {searchQuery ? (
                            <FlatList
                                data={filteredUsers}
                                keyExtractor={(item) => item.id}
                                renderItem={({ item }) => (
                                    <BodyText
                                        paddingLeft={10}
                                        fontSize={16}
                                        color={colors.white}
                                        paddingVertical={12}
                                        borderBottomColor={colors.silver1Procent50}
                                        borderBottomWidth={1}
                                    >
                                        {item.name}
                                    </BodyText>
                                )}


                                ListEmptyComponent={() => {
                                    return (
                                        <View style={[{
                                            flex: 1,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            paddingHorizontal: 20,
                                        }]}>
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

                )}


            </View >
            <ProfileVideoModal
                modalVideo={modalVideo}
                activeVideoIds={activeVideoIds}
                onArrowPress={() => setModalVideo(null)}
                tapX={tapX}
                tapY={tapY}
                scale={scale}
                opacity={opacity}
                handleDoubleTap={(event) => handleDoubleTap(event)}
            />

            {/* MenuModal */}
            <MenuModal visible={visible} onVisible={() => setVisible(false)} />
        </>
    );
};

export default ProfileScreen;
