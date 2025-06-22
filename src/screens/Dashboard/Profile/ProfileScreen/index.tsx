import React, { useCallback, useEffect, useState } from 'react';
import { View, SafeAreaView, TouchableOpacity, FlatList, Dimensions, RefreshControl, ActivityIndicator } from 'react-native';
import { colors, positionHelpers } from '../../../../styles';
import CustomHeader from '../../../../components/old/navigator/CustomHeader';
import { useNavigation } from '@react-navigation/native';
import { DASHBOARD_ROUTES } from '../../../../navigation/routes';
import { BodyText, ButtonDefault, LoaderIndicator, SvgIcon } from '../../../../components/old/UI';
import ProfileInfo from './components/ProfileInfo';
import { cs } from './styles';
import { RootState, useReduxDispatch, useReduxSelector } from '../../../../store/store';
import { getVideosAction } from '../../../../redux/CameraRedux/cameraActions';
import MenuModal from '../../../../components/old/Modals/MenuModal';
import VideoItem from '../../../../components/old/VideoItem';
const MemoVideoItem = React.memo(VideoItem);
import { setIsSearchActive, setMenuModal } from '../../../../redux/ModalsRedux/modalSlice';
import FullVideoModal from '../../../../components/old/Modals/FullVideoModal';
import SearchAnimatedModal from '../../../../components/old/Modals/SearchAnimatedModal';
import { VideoItemType } from '../../../../redux/CameraRedux/types';
import EmptyContent from '../../../../components/old/EmptyContent';
import { useUser } from '../../../../state/user/authStore.ts';

const SCREEN_WIDTH = Dimensions.get('window').width;
const ITEM_MARGIN = 4;
const NUM_COLUMNS = 3;
const ITEM_SIZE = (SCREEN_WIDTH - ITEM_MARGIN * (NUM_COLUMNS + 1) - 32) / NUM_COLUMNS;

const ProfileScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const dispatch = useReduxDispatch();
  const {loading} = useReduxSelector((state: RootState) => state.camera);
  const user = useUser();
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [videos, setVideos] = useState<VideoItemType[]>([]);
  const [page, setPage] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const TAKE = 15;

  const [modalVideo, setModalVideo] = useState<VideoItemType | null>(null);

  useEffect(() => {
    if (user?.id) {
      fetchVideos(true);
    }
  }, [fetchVideos, user?.id]);

  const fetchVideos = useCallback(async (reset = false) => {
    const skip = reset ? 0 : page * TAKE;

    const resultAction = await dispatch(
      getVideosAction({
        userId: user?.id,
        where: {},
        orderBy: {createdAt: 'desc'},
        skip,
        take: TAKE,
      }),
    );

    const newVideos = resultAction?.payload || [];

    if (reset) {
      setVideos(newVideos);
      setPage(1);
    } else {
      setVideos(prev => [...prev, ...newVideos]);
      setPage(prev => prev + 1);
    }

    setHasMore(newVideos.length === TAKE);
  });

  const filteredVideos = React.useMemo(
    () => videos.filter(v => v?.file?.storagePath),
    [videos],
  );

  const renderVideoItem = useCallback(
    ({item, index}: {item: VideoItemType; index: number}) => {
      const isLastInRow = (index + 1) % NUM_COLUMNS === 0;
      const screenshot = item.file?.variation?.[0]?.screenshots?.[0] ?? null;

      return (
        <MemoVideoItem
          key={item?.id}
          item={item}
          user={user}
          screenshot={screenshot}
          isLastInRow={isLastInRow}
          ITEM_SIZE={ITEM_SIZE}
          onVideoPress={() => setModalVideo(item)}
        />
      );
    },
    [user],
  );

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    if (user?.id) {
      await fetchVideos(true);
    }
    setRefreshing(false);
  }, [user?.id, fetchVideos]);

  const handleLoadMore = useCallback(async () => {
    if (!loadingMore && hasMore) {
      setLoadingMore(true);
      await fetchVideos();
      setLoadingMore(false);
    }
  }, [loadingMore, hasMore, fetchVideos]);

  return (
    <>
      <View style={positionHelpers.fill}>
        <CustomHeader title="00:00:00" />
        <SafeAreaView
          style={[
            positionHelpers.fill,
            {
              backgroundColor: colors.black4,
            },
          ]}>
          <View style={[positionHelpers.ph16, positionHelpers.mb10]}>
            <View
              style={[
                positionHelpers.mt10,
                positionHelpers.alignItemsCenterRow,
              ]}>
              <View style={positionHelpers.fill}>
                <TouchableOpacity
                  style={cs.input}
                  onPress={() => dispatch(setIsSearchActive(true))}>
                  <BodyText color={colors.silver1Procent50}>
                    Search by user
                  </BodyText>
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                style={cs.ml15}
                onPress={() => dispatch(setMenuModal(true))}>
                <SvgIcon image="menu" />
              </TouchableOpacity>
            </View>

            <ProfileInfo
              fullName={`${user?.firstName} ${user?.lastName}`}
              followerCount={user?.stats?.followerCount}
              likeCount={user?.stats?.likeCount}
              followCount={user?.stats?.followCount}
              onChatPress={() =>
                navigation.navigate(DASHBOARD_ROUTES.CHAT_LIST_SCREEN)
              }
            />

            <ButtonDefault
              buttoStyles={[
                positionHelpers.mt15,
                positionHelpers.alignCenter,
                cs.uploadVideoButton,
              ]}
              onPress={() =>
                navigation.navigate(DASHBOARD_ROUTES.VIDEO_RECORD_SCREEN)
              }>
              <BodyText fontWeight="bold" fontSize={16} color={colors.blue3}>
                Upload & Share
              </BodyText>
            </ButtonDefault>
          </View>

          {loading && filteredVideos.length === 0 ? (
            <LoaderIndicator variantTwo />
          ) : filteredVideos.length === 0 ? (
            <EmptyContent />
          ) : (
            <FlatList
              data={filteredVideos}
              keyExtractor={item => item.id}
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
        </SafeAreaView>
      </View>

      {/* Search Modal */}
      <SearchAnimatedModal />

      {/* Video Full Modal */}
      <FullVideoModal modalVideo={modalVideo} setModalVideo={setModalVideo} />

      {/* MenuModal */}
      <MenuModal onVisible={() => dispatch(setMenuModal(false))} />
    </>
  );
};

export default React.memo(ProfileScreen);
