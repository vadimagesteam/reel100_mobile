import React, { useCallback, useEffect, useState } from 'react';
import { Dimensions, FlatList, Image, RefreshControl, SafeAreaView, TouchableOpacity, View } from 'react-native';
import { colors, positionHelpers } from '../../../styles';
import { BodyText, LoaderIndicator, SvgIcon } from '../../../components/UI';
import MenuModal from '../../../components/Modals/MemuModal';
import { useNavigation, useRoute } from '@react-navigation/native';
import ButtonGradient from '../../../components/ButtonGradient';
import CustomHeader from '../../../components/navigator/CustomHeader';
import LinearGradient from 'react-native-linear-gradient';
import { RootState, useReduxDispatch, useReduxSelector } from '../../../store/store';
import { getOneUserAction } from '../../../redux/UsersRedux/usersAction';
import { getUserVideosAction } from '../../../redux/CameraRedux/cameraActions';
import FastImage from 'react-native-fast-image';
import VideoAbsoluteInfo from '../../../components/VideoAbsoluteInfo';
import { VideoItemType } from '../FourU/FourUScreen/types';
import ProfileVideoModal from '../Profile/ProfileScreen/components/ProfileVideoModal';
import { useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import { HandlerStateChangeEvent, State, TapGestureHandlerEventPayload } from 'react-native-gesture-handler';
import { getFollowAction, setFollowAction, unFollowAction } from '../../../redux/FollowsRedux/followsActions';

const SCREEN_WIDTH = Dimensions.get('window').width;
const ITEM_MARGIN = 4;
const NUM_COLUMNS = 3;
const ITEM_SIZE = (SCREEN_WIDTH - ITEM_MARGIN * (NUM_COLUMNS + 1) - 32) / NUM_COLUMNS;

const UserProfileScreen = () => {
    const navigation = useNavigation();
    const { params } = useRoute();
    const dispatch = useReduxDispatch();
    const { userOneData } = useReduxSelector((state: RootState) => state?.users);
    const { user } = useReduxSelector((state: RootState) => state?.auth);
    const { userVideos } = useReduxSelector((state: RootState) => state?.camera);
    const { followData } = useReduxSelector((state: RootState) => state?.follows);
    const [visible, setVisible] = useState<boolean>(false);
    const [loader, setLoader] = useState(false);

    const [activeVideoIds, setActiveVideoIds] = useState<string[]>([]);
    const [modalVideo, setModalVideo] = useState<VideoItemType | null>(null);
    const [refreshing, setRefreshing] = useState(false);
    const scale = useSharedValue(0);
    const opacity = useSharedValue(1);
    const tapX = useSharedValue(0);
    const tapY = useSharedValue(0);
    const [isFollowing, setIsFollowing] = useState<boolean>(false);

    console.log('params-->', params);
    useEffect(() => {
        dispatch(getOneUserAction(params?.idUser));
        dispatch(getUserVideosAction(params?.idUser));
        dispatch(getFollowAction(params?.idUser));
    }, []);

    useEffect(() => {
        setLoader(true);
        const timeout = setTimeout(() => {
            setLoader(false);
        }, 1000);

        return () => clearTimeout(timeout);
    }, []);

    const filteredVideos = userVideos.filter(v => v?.file?.storagePath);

    const handleRefresh = async () => {
        setRefreshing(true);

        setTimeout(async () => {
            await dispatch(getUserVideosAction(params?.idUser));

            setRefreshing(false);
        }, 1000);



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
                            name={`${userOneData?.firstName} ${userOneData?.lastName}`}
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

    // console.log('followData', JSON.stringify(followData, null, 2));

    // const checkFollowStatus = () => {
    //     const follow = followData[0];

    //     const isFollowing = follow?.who?.id === user?.id && follow?.whom?.id === params?.idUser;
    //     setIsFollowing(isFollowing);
    // };


    const followUserCallback = () => {
        const dataFollow = {
            who: { id: user?.id },
            whom: { id: params?.idUser },
        };

        console.log('dataFollow--->', dataFollow);

        // if (isFollowing) {

        // dispatch(unFollowAction(params?.idUser));
        // } else {
        // Викликаємо action для підписки
        dispatch(setFollowAction(dataFollow));
        // }
        // checkFollowStatus();


    };

    return (
        <>
            {loader && (
                <LoaderIndicator />
            )}

            {!loader && (
                <>
                    <CustomHeader title="00:00:00" />
                    <SafeAreaView
                        style={[
                            positionHelpers.fill,
                            positionHelpers.mb25,
                            {
                                backgroundColor: colors.black4,
                                marginBottom: 60,
                            },
                        ]}
                    >
                        <View style={[positionHelpers.ph16, positionHelpers.mb10]}>
                            <View style={[positionHelpers.mt20, positionHelpers.rowFillCenter]}>
                                <TouchableOpacity onPress={() => {
                                    navigation.goBack();

                                }}>
                                    <SvgIcon image="backArrow" />
                                </TouchableOpacity>
                                <TouchableOpacity style={{ marginLeft: 15 }} onPress={() => setVisible(true)}>
                                    <SvgIcon image="menu" />
                                </TouchableOpacity>

                            </View>

                            {/* Profile header info */}
                            <View style={{ alignItems: 'center' }}>
                                <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/512/9203/9203764.png' }} style={{ height: 70, width: 70 }} />
                                <BodyText fontWeight={'700'} fontSize={20} color={colors.white} marginTop={5}>{userOneData?.firstName} {userOneData?.lastName}</BodyText>
                                <ButtonGradient
                                    buttonStyles={{ maxWidth: '30%' }}
                                    // marginText={8} title={'Follow'}
                                    marginText={8}
                                    title={'Follow'}
                                    // title={isFollowing ? 'Unfollow' : 'Follow'}
                                    onPress={() => followUserCallback()}
                                // onPress={() => true}
                                />

                            </View>

                            <LinearGradient start={{ x: 0.1, y: 0.5 }}
                                end={{ x: 0.9, y: 0 }}
                                colors={[colors.blue1, colors.blue]}
                                style={[positionHelpers.alignItemsCenterRow, { height: 70, borderRadius: 10 }]}>
                                <TouchableOpacity style={[positionHelpers.center, positionHelpers.fill, { height: '100%' }]}>
                                    <BodyText fontWeight={'bold'} fontSize={20} color={colors.silver3}>0</BodyText>
                                    <BodyText fontWeight={'500'} fontSize={16} color={colors.silver3} marginTop={3}>Followers</BodyText>
                                </TouchableOpacity>
                                <TouchableOpacity style={[positionHelpers.center, positionHelpers.fill, { height: '100%', borderLeftWidth: 0.5, borderRightWidth: 0.5, borderRightColor: colors.silver1, borderLeftColor: colors.silver1 }]}>
                                    <BodyText fontWeight={'bold'} fontSize={20} color={colors.silver3}>0</BodyText>
                                    <BodyText fontWeight={'500'} fontSize={16} color={colors.silver3} marginTop={3}>Likes</BodyText>
                                </TouchableOpacity>
                                <TouchableOpacity style={[positionHelpers.center, positionHelpers.fill, { height: '100%' }]}>
                                    <BodyText fontWeight={'bold'} fontSize={20} color={colors.silver3}>0</BodyText>
                                    <BodyText fontWeight={'500'} fontSize={16} color={colors.silver3} marginTop={3}>Following</BodyText>
                                </TouchableOpacity>

                            </LinearGradient>

                            {/* <ProfileInfo fullName={`${user?.firstName} ${user?.lastName}`} /> */}

                            {/* <ButtonDefault
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
                    </View> */}

                            {/* <FlatList
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
                    /> */}

                        </View>
                        {filteredVideos.length === 0 ? (
                            <View style={positionHelpers.fillCenter}>
                                <BodyText color={colors.white}>{'No video found'}</BodyText>
                            </View>
                        ) : (
                            <FlatList
                                data={filteredVideos.reverse()}
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
                            />
                        )}
                    </SafeAreaView >
                </>
            )}

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
            < MenuModal visible={visible} onVisible={() => setVisible(false)} />
        </>
    );
};

export default UserProfileScreen;
