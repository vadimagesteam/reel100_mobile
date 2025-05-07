import React, { useEffect, useState } from 'react';
import { View, SafeAreaView, TouchableOpacity, ScrollView, FlatList, Dimensions, Image } from 'react-native';
import FastImage from 'react-native-fast-image';
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

const SCREEN_WIDTH = Dimensions.get('window').width;
const ITEM_MARGIN = 4;
const NUM_COLUMNS = 3;
const ITEM_SIZE = (SCREEN_WIDTH - ITEM_MARGIN * (NUM_COLUMNS + 1) - 32) / NUM_COLUMNS;

const ProfileScreen = () => {
    const navigation = useNavigation<any>();
    const dispatch = useReduxDispatch();
    const { userVideos } = useReduxSelector((state: RootState) => state.camera);
    const { userID } = useReduxSelector((state: RootState) => state.auth);
    const [activeVideoIds, setActiveVideoIds] = useState<string[]>([]);
    const [modalVideo, setModalVideo] = useState<VideoItemType | null>(null);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        dispatch(getUserVideosAction(userID));
    }, []);

    const filteredVideos = userVideos.filter(v => v?.file?.storagePath);

    // console.log('---filteredVideos-->', filteredVideos);
    const handleRefresh = async () => {
        setRefreshing(true);
        try {
            await dispatch(getUserVideosAction(userID));
        } finally {
            setRefreshing(false);
        }
    };

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

    return (
        <>
            <CustomHeader title="00:00:00" />
            <SafeAreaView
                style={[
                    positionHelpers.fill,
                    positionHelpers.mb25,
                    { backgroundColor: colors.black4, marginBottom: 70 },
                ]}
            >
                <View style={[positionHelpers.ph16, positionHelpers.mb10]}>
                    <View style={[positionHelpers.mt10, positionHelpers.alignItemsCenterRow]}>
                        <View style={positionHelpers.fill}>
                            <Input inputStyles={cs.input} placeholder="Search by user" />
                        </View>
                        <TouchableOpacity onPress={() => true}>
                            <SvgIcon image="menu" />
                        </TouchableOpacity>
                    </View>

                    <ProfileInfo />

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
            </SafeAreaView>

            <ProfileVideoModal
                modalVideo={modalVideo}
                activeVideoIds={activeVideoIds}
                onArrowPress={() => setModalVideo(null)}
            />
        </>
    );
};

export default ProfileScreen;
