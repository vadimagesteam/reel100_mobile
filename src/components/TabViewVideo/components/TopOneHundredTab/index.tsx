import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { FlatList, Dimensions, SafeAreaView, View } from 'react-native';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import {
  runOnJS,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { Gesture } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  RootState,
  useReduxDispatch,
  useReduxSelector,
} from '../../../../store/store';
import { getVideosTopAction } from '../../../../redux/CameraRedux/cameraActions';
import { colors, positionHelpers } from '../../../../styles';
import {
  deleteLikeAction,
  getLikesAction,
  setLikeAction,
} from '../../../../redux/LikesRedux/likesAction';
import { setPage } from '../../../../redux/CameraRedux/cameraSlice';
import { VideoItemType } from '../../../../redux/CameraRedux/types';
import { DASHBOARD_ROUTES } from '../../../../navigation/routes';
import { getVideoCommentsAction } from '../../../../redux/VideoRedux/videoAction';
import { LoaderIndicator } from '../../../UI';
import VideoListItem from '../../../VideoScrollList/VideoListItem';
import { useHeartAnimatedStyle } from '../../../../utils/animatedHeartStyle';
import { getOneUserAction } from '../../../../redux/UsersRedux/usersAction.tsx';
import HeaderCalendar from './components/HeaderCalendar';
import { useCalendarModal } from './hooks/useCalendarModal.ts';
import { setMenuModal } from '../../../../redux/ModalsRedux/modalSlice.ts';
import CalendarModal from '../../../CalendarModal';
import MenuModal from '../../../Modals/MenuModal';

const MemoVideoListItem = React.memo(VideoListItem);
const MemoizedHeaderCalendar = React.memo(HeaderCalendar);

const { height } = Dimensions.get('window');
const TAKE = 5;

export interface TopOneHundredTabProps {
  withCalendar?: boolean;
  withMenu?: boolean;
}

const TopOneHundredTab = ({
                            withCalendar = false,
                            withMenu = false,
                          }: TopOneHundredTabProps) => {
  const navigation = useNavigation<any>();
  const isFocused = useIsFocused();
  const dispatch = useReduxDispatch();

  // Use narrowed selectors to minimize parent rerenders
  const likesData = useReduxSelector((state: RootState) => state.likes.likesData);
  const user = useReduxSelector((state: RootState) => state.auth.user);
  const videosTop100 = useReduxSelector((state: RootState) => state.camera.videosTop100);
  const page = useReduxSelector((state: RootState) => state.camera.page);
  const hasMore = useReduxSelector((state: RootState) => state.camera.hasMore);
  const loadingTopTab = useReduxSelector((state: RootState) => state.camera.loadingTopTab);

  const scrollIndexRef = useRef(0);

  const insets = useSafeAreaInsets();
  const tabNavigationHeight = Math.max(150, Math.min(height * 0.17, 250));
  const videoHeight = height - insets.top - insets.bottom - tabNavigationHeight;

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [durations, setDurations] = useState<{ [key: string]: number }>({});
  const [timeLefts, setTimeLefts] = useState<{ [key: string]: number }>({});

  // Heart animation values
  const scale = useSharedValue(0);
  const opacity = useSharedValue(1);
  const tapX = useSharedValue(0);
  const tapY = useSharedValue(0);
  const animatedStyle = useHeartAnimatedStyle(tapX, tapY, scale, opacity);

  //---------- Calendar ----------
  const {
    isVisible,
    selectedDate,
    tempDate,
    open,
    cancel,
    confirm,
    setTempDate,
    marked,
  } = useCalendarModal();

  const openMenu = useCallback(() => {
    dispatch(setMenuModal(true));
  }, [dispatch]);

  // Prefetch more videos as needed
  useEffect(() => {
    if (hasMore && currentIndex >= videosTop100.length - 2) {
      const skip = (page - 1) * TAKE;
      dispatch(getVideosTopAction({ skip, take: TAKE, orderBy: { createdAt: 'desc' } }));
    }
  }, [currentIndex, dispatch, hasMore, page, videosTop100.length]);

  // Fetch likes when current video changes
  useEffect(() => {
    if (videosTop100.length === 0) return;
    const currentVideo = videosTop100[currentIndex];
    if (!currentVideo) return;
    dispatch(getLikesAction({ userId: user?.id, videoId: currentVideo.id }));
  }, [currentIndex, dispatch, user?.id, videosTop100]);

  // Fetch more on end reached
  const onEndReached = useCallback(() => {
    if (!loadingTopTab && hasMore) {
      const skip = (page - 1) * TAKE;
      dispatch(getVideosTopAction({ skip, take: TAKE, orderBy: { createdAt: 'desc' } }));
      dispatch(setPage(page + 1));
    }
  }, [loadingTopTab, hasMore, dispatch, page]);

  // Memoize viewabilityConfig and onViewableItemsChanged
  const viewabilityConfig = useMemo(() => ({ itemVisiblePercentThreshold: 80 }), []);

  const onViewableItemsChanged = useCallback(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      const index = viewableItems[0].index;
      setCurrentIndex(index);
      scrollIndexRef.current = index;
    }
  }, []);

  // Memoized handler for onLoad event in video
  const handleLoad = useCallback((id: string, data: { duration: number }) => {
    setDurations(prev => ({ ...prev, [id]: data.duration }));
    setTimeLefts(prev => ({ ...prev, [id]: Math.floor(data.duration) }));
  }, []);

  // Single tap handler
  const handleSingleTap = useCallback((item: VideoItemType, index: number) => {
    dispatch(getVideoCommentsAction({ videoId: item?.id, userId: item?.user.id }));
    navigation.navigate(DASHBOARD_ROUTES.FULL_VIDEO_SCREEN, {
      initialIndex: index,
      videos: [...videosTop100],
      videoIdParam: item?.id,
      userIdParam: item?.user?.id,
    });
  }, [dispatch, navigation, videosTop100]);

  // Double tap handler
  const handleDoubleTap = useCallback(
    (x: number, y: number, videoId: string, videoOwnerId: string) => {
      if (!videoId || !user?.id) return;
      // animation heart
      tapX.value = x;
      tapY.value = y;
      scale.value = 1;
      opacity.value = 1;
      scale.value = withSpring(1.2, { damping: 5, stiffness: 100 }, () => {
        scale.value = withTiming(0, { duration: 500 });
        opacity.value = withTiming(0, { duration: 500 });
      });

      const existingLike = likesData.find(
        like => like.user?.id === user?.id && like.video?.id === videoId,
      );

      if (existingLike) {
        dispatch(deleteLikeAction({ id: existingLike.id, userId: videoOwnerId, videoId }));
      } else {
        const likesBodyData = {
          dataLike: {
            typeField: 'Like',
            user: { id: user?.id },
            video: { id: videoId },
          },
          userId: videoOwnerId,
        };
        dispatch(setLikeAction(likesBodyData));
      }
    },
    [dispatch, likesData, user?.id, tapX, tapY, scale, opacity]
  );

  // --- Memoized gesture creators ---
  const singleTapGesture = useCallback(
    (item: VideoItemType, index: number) =>
      Gesture.Tap()
        .maxDelay(250)
        .numberOfTaps(1)
        .onEnd(() => {
          runOnJS(handleSingleTap)(item, index);
        }),
    [handleSingleTap]
  );

  const doubleTapGesture = useCallback(
    (videoId: string, videoOwnerId: string) =>
      Gesture.Tap()
        .numberOfTaps(2)
        .onEnd(event => {
          runOnJS(handleDoubleTap)(event.x, event.y, videoId, videoOwnerId);
        }),
    [handleDoubleTap]
  );

  const combinedGesture = useCallback(
    (item: VideoItemType, index: number) =>
      Gesture.Exclusive(
        doubleTapGesture(item.id, item.user.id),
        singleTapGesture(item, index),
      ),
    [doubleTapGesture, singleTapGesture]
  );

  // --- Memoized renderItem ---
  const renderItem = useCallback(
    ({ item, index }: { item: VideoItemType; index: number }) => {
      const isActive = index === currentIndex && isFocused;
      const itemFile = item.file !== null;
      if (!itemFile) return null;

      return (
        <View collapsable={false}>
          <MemoVideoListItem
            item={item}
            index={index}
            isActive={isActive}
            muted={true}
            videoHeight={videoHeight}
            gesture={combinedGesture(item, index)}
            onLoad={data => handleLoad(item.id, data)}
            durations={durations}
            setTimeLefts={setTimeLefts}
            timeLeft={timeLefts[item.id] || 0}
            likesData={likesData}
            likeCheck={likesData.some(like => like?.user?.id === user?.id)}
            animatedStyle={animatedStyle}
            onNameClick={() => {
              if (user?.id !== item.user.id) {
                dispatch(getOneUserAction(item.user.id));
                navigation.navigate(DASHBOARD_ROUTES.USER_PROFILE_SCREEN, {
                  idUser: item.user.id,
                });
              }
            }}
            onShare={function (): void {
              throw new Error('Function not implemented.');
            }}
          />
        </View>
      );
    },
    [
      currentIndex,
      isFocused,
      videoHeight,
      combinedGesture,
      handleLoad,
      durations,
      setTimeLefts,
      timeLefts,
      likesData,
      user?.id,
      animatedStyle,
      dispatch,
      navigation,
    ]
  );

  // Memoize renderFooter
  const renderFooter = useCallback(() => {
    if (!loadingTopTab) return null;
    return <LoaderIndicator variantTwo />;
  }, [loadingTopTab]);

  return (
    <>
      {withCalendar && (
        <SafeAreaView style={[{ backgroundColor: colors.black4 }]}>
          <MemoizedHeaderCalendar
            openMenu={openMenu}
            markerDate={selectedDate}
            onCalendar={open}
            showMenu={withMenu}
          />
        </SafeAreaView>
      )}
      <FlatList
        data={videosTop100}
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        snapToInterval={videoHeight}
        decelerationRate="fast"
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        initialScrollIndex={scrollIndexRef.current}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.3}
        ListFooterComponent={renderFooter}
        style={positionHelpers.fill}
        initialNumToRender={6}
        windowSize={6}
        maxToRenderPerBatch={6}
        removeClippedSubviews={true}
      />
      {withCalendar && (
        <CalendarModal
          isCalendarModal={isVisible}
          marked={marked}
          currentDate={tempDate}
          setVisibleDate={setTempDate}
          onCancelPress={cancel}
          onSubmitPress={confirm}
        />
      )}
      {withMenu && (
        <MenuModal onVisible={() => dispatch(setMenuModal(false))} />
      )}
    </>
  );
};

export default React.memo(TopOneHundredTab);