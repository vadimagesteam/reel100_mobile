import { useMemo } from 'react';
import { AppHeader, AppHeaderHeight } from '../../../components/appHeader/AppHeader.tsx';
import { HidebleContainer } from '../../../components/hidebleContainer';
import { VideoFeedProvider } from '../../../components/videoFeed';
import { useVideosInfiniteQuery } from '../../../components/videoFeed/hooks';
import { TileListBlock } from '../../../components/stateFeed/TileListBlock.tsx';
import { generateBlocks } from '../../../components/stateFeed/helpers/generateBlocks.ts';
import { VideoTiles } from '../../../components/videoTiles/VideoTiles.tsx';

export const TabForYouScreen = () => {
  const cacheKey = useMemo(() => ['for_you_videos'], []);

  const controllers = useVideosInfiniteQuery({
    cacheKey,
    orderBy: { createdAt: 'desc' },
    where: { 'where[status]': 'Finished' },
  });

  return (
    <HidebleContainer hideOffset={AppHeaderHeight} className="flex-1 bg-black4">
      <AppHeader stateSelect />
      <VideoFeedProvider initialState={{ cacheKey: cacheKey }}>
        <VideoTiles
          queryControl={controllers}
          ItemComponent={TileListBlock}
          prepareData={generateBlocks}
        />
      </VideoFeedProvider>
    </HidebleContainer>
  );
};
