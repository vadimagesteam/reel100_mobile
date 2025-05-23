import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, FlatList, RefreshControl, SafeAreaView, TouchableOpacity, View } from 'react-native';
import { positionHelpers } from '../../../styles';
import { LoaderIndicator, SvgIcon } from '../../../components/UI';
import MenuModal from '../../../components/Modals/MemuModal';
import { useNavigation, useRoute } from '@react-navigation/native';
import CustomHeader from '../../../components/navigator/CustomHeader';
import { RootState, useReduxDispatch, useReduxSelector } from '../../../store/store';
import { getOneUserAction } from '../../../redux/UsersRedux/usersAction';
import { getVideosAction } from '../../../redux/CameraRedux/cameraActions';
import { getFollowAction, setFollowAction, unFollowAction } from '../../../redux/FollowsRedux/followsActions';
import FullVideoModal from '../../../components/Modals/FullVideoModal';
import { setMenuModal } from '../../../redux/ModalsRedux/modalSlice';
import VideoItem from '../../../components/VideoItem';
import ProfileUserInfo from './components/ProfileUserInfo';
import { cs } from './styles';
import { VideoItemType } from '../../../redux/CameraRedux/types';
import EmptyContent from '../../../components/EmptyContent';

const SCREEN_WIDTH = Dimensions.get('window').width;
const ITEM_MARGIN = 4;
const NUM_COLUMNS = 3;
const ITEM_SIZE = (SCREEN_WIDTH - ITEM_MARGIN * (NUM_COLUMNS + 1) - 32) / NUM_COLUMNS;

const UserProfileScreen = () => {
    const navigation = useNavigation();
    const { params } = useRoute<any>();
    const dispatch = useReduxDispatch();
    const { userOneData } = useReduxSelector((state: RootState) => state?.users);
    const { user } = useReduxSelector((state: RootState) => state?.auth);
    const { loading } = useReduxSelector((state: RootState) => state?.camera);
    const { followData } = useReduxSelector((state: RootState) => state?.follows);
    const [loader, setLoader] = useState(false);
    const [modalVideo, setModalVideo] = useState<VideoItemType | null>(null);
    const [refreshing, setRefreshing] = useState(false);
    const [videos, setVideos] = useState<VideoItemType[]>([]);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);

    const TAKE = 15;

    const [isFollowing, setIsFollowing] = useState<boolean>(false);

    useEffect(() => {
        dispatch(getOneUserAction(params?.idUser));
        dispatch(getFollowAction({ myId: user?.id, userId: params?.idUser }));
        fetchVideos(true);
    }, [user?.id, params?.idUser]);

    const fetchVideos = async (reset = false) => {
        const skip = reset ? 0 : page * TAKE;

        const result = await dispatch(getVideosAction({
            userId: params?.idUser,
            skip,
            take: TAKE,
            orderBy: { createdAt: 'desc' },
        }));

        const newVideos = result?.payload || [];

        if (reset) {
            setVideos(newVideos);
            setPage(1);
        } else {
            setVideos(prev => [...prev, ...newVideos]);
            setPage(prev => prev + 1);
        }

        setHasMore(newVideos.length === TAKE);
    };


    useEffect(() => {
        setLoader(true);
        const timeout = setTimeout(() => {
            setLoader(false);
        }, 1000);

        return () => clearTimeout(timeout);
    }, []);

    useEffect(() => {
        setIsFollowing(Array.isArray(followData) && followData.length > 0);
    }, [followData]);

    const filteredVideos = videos.filter(v => v?.file?.storagePath);

    const renderVideoItem = useCallback(({ item, index }: { item: VideoItemType; index: number }) => {
        const isLastInRow = (index + 1) % NUM_COLUMNS === 0;
        const screenshot =
            item.file?.variation?.[0]?.screenshots?.[0] ?? null;

        return (
            <VideoItem
                key={item?.id}
                item={item}
                user={userOneData}
                screenshot={screenshot}
                isLastInRow={isLastInRow}
                ITEM_SIZE={ITEM_SIZE}
                onVideoPress={() => setModalVideo(item)}
            />
        );
    }, [userOneData]);

    const followUserCallback = () => {
        const dataFollow = {
            who: { id: user?.id },
            whom: { id: params?.idUser },
        };

        if (isFollowing) {
            const followId = followData[0]?.id;

            if (followId) {
                dispatch(unFollowAction({ id: followId, myId: user?.id, userId: params?.idUser }));
            } else {
                console.log('Не знайдено підписки для видалення');
            }
        } else {
            dispatch(setFollowAction(dataFollow));
        }

        setIsFollowing(!isFollowing);
    };

    const handleRefresh = async () => {
        setRefreshing(true);
        setTimeout(async () => {
            await fetchVideos(true);
            setRefreshing(false);
        }, 800);
    };

    const handleLoadMore = async () => {
        if (!loadingMore && hasMore) {
            setLoadingMore(true);
            await fetchVideos(false);
            setLoadingMore(false);
        }
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
                            cs.container,
                        ]}
                    >
                        <View style={[positionHelpers.ph16, positionHelpers.mb10]}>
                            <View style={[positionHelpers.mt20, positionHelpers.rowFillCenter]}>
                                <TouchableOpacity onPress={() => {
                                    navigation.goBack();

                                }}>
                                    <SvgIcon image="backArrow" />
                                </TouchableOpacity>
                                <TouchableOpacity style={cs.ml15} onPress={() => dispatch(setMenuModal(true))}>
                                    <SvgIcon image="menu" />
                                </TouchableOpacity>
                            </View>

                            {/* Profile header info */}
                            <ProfileUserInfo
                                fullname={`${userOneData?.firstName} ${userOneData?.lastName}`}
                                followerCount={userOneData?.stats?.followerCount}
                                likeCount={userOneData?.stats?.likeCount}
                                followCount={userOneData?.stats?.followCount}
                                checkFollowButton={isFollowing ? 'Unfollow' : 'Follow'}
                                onFollowPress={() => followUserCallback()}
                            />
                        </View>
                        {loading && filteredVideos.length === 0 ? (
                            <LoaderIndicator variantTwo />
                        ) : filteredVideos.length === 0 ? (
                            <EmptyContent />
                        ) : (
                            <FlatList
                                data={filteredVideos.reverse()}
                                keyExtractor={(item) => item.id}
                                numColumns={NUM_COLUMNS}
                                renderItem={renderVideoItem}
                                contentContainerStyle={[positionHelpers.ph16, cs.pb10]}
                                initialNumToRender={6}
                                windowSize={5}
                                maxToRenderPerBatch={6}
                                removeClippedSubviews={true}
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
                                ListFooterComponent={
                                    loadingMore && hasMore ? (
                                        <ActivityIndicator color="#fff" />
                                    ) : null
                                }
                            />
                        )}
                    </SafeAreaView >
                </>
            )}
            {/* Video Full Modal */}
            <FullVideoModal
                modalVideo={modalVideo}
                setModalVideo={setModalVideo}
            />

            {/* MenuModal */}
            <MenuModal onVisible={() => dispatch(setMenuModal(false))} />
        </>
    );
};

export default UserProfileScreen;
