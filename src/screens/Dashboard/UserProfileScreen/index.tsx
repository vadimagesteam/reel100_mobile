import React, { useCallback, useEffect, useState } from 'react';
import { Dimensions, FlatList, RefreshControl, SafeAreaView, TouchableOpacity, View } from 'react-native';
import { colors, positionHelpers } from '../../../styles';
import { BodyText, LoaderIndicator, SvgIcon } from '../../../components/UI';
import MenuModal from '../../../components/Modals/MemuModal';
import { useNavigation, useRoute } from '@react-navigation/native';
import CustomHeader from '../../../components/navigator/CustomHeader';
import { RootState, useReduxDispatch, useReduxSelector } from '../../../store/store';
import { getOneUserAction } from '../../../redux/UsersRedux/usersAction';
import { getUserVideosAction } from '../../../redux/CameraRedux/cameraActions';
import { getFollowAction, setFollowAction, unFollowAction } from '../../../redux/FollowsRedux/followsActions';
import FullVideoModal from '../../../components/Modals/FullVideoModal';
import { setMenuModal } from '../../../redux/ModalsRedux/modalSlice';
import VideoItem from '../../../components/VideoItem';
import ProfileUserInfo from './components/ProfileUserInfo';
import { cs } from './styles';
import { VideoItemType } from '../../../redux/CameraRedux/types';

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
    const { userVideos } = useReduxSelector((state: RootState) => state?.camera);
    const { followData } = useReduxSelector((state: RootState) => state?.follows);
    const [loader, setLoader] = useState(false);
    const [modalVideo, setModalVideo] = useState<VideoItemType | null>(null);

    const [refreshing, setRefreshing] = useState(false);

    const [isFollowing, setIsFollowing] = useState<boolean>(false);

    // console.log('user--->', user);
    console.log('followData--->', followData,);
    useEffect(() => {
        dispatch(getOneUserAction(params?.idUser));
        dispatch(getUserVideosAction(params?.idUser));
        dispatch(getFollowAction({ myId: user?.id, userId: params?.idUser }));
    }, [user?.id, params?.idUser]);

    useEffect(() => {
        setLoader(true);
        const timeout = setTimeout(() => {
            setLoader(false);
        }, 1000);

        return () => clearTimeout(timeout);
    }, []);


    //!!!!!!!
    /// CHANGE SOLUTION
    // If followData length > 0 ? follow : unfolo
    ////
    ///
    ///
    useEffect(() => {
        setIsFollowing(Array.isArray(followData) && followData.length > 0);
    }, [followData]);


    // useEffect(() => {
    //     if (followData && Array.isArray(followData)) {
    //         const isFollow = followData.some(follow =>
    //             follow?.who?.id === user?.id &&
    //             follow?.whom?.id === params?.idUser
    //         );
    //         setIsFollowing(isFollow);
    //     }
    // }, [followData]);

    const filteredVideos = userVideos.filter(v => v?.file?.storagePath);

    const handleRefresh = async () => {
        setRefreshing(true);

        setTimeout(async () => {
            await dispatch(getUserVideosAction(params?.idUser));

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
                        {filteredVideos.length === 0 ? (
                            <View style={positionHelpers.fillCenter}>
                                <BodyText color={colors.white}>{'No video found'}</BodyText>
                            </View>
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
                            />
                        )}
                    </SafeAreaView >
                </>
            )}
            {/* Video Full Modal */}
            <FullVideoModal
                modalVideo={modalVideo}
                onArrowPress={() => setModalVideo(null)}
            />

            {/* MenuModal */}
            <MenuModal onVisible={() => dispatch(setMenuModal(false))} />
        </>
    );
};

export default UserProfileScreen;
