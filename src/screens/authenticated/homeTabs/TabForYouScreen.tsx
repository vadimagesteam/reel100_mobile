import { useMemo } from 'react';
import { AppHeader, AppHeaderHeight } from '../../../components/AppHeader/AppHeader.tsx';
import { HidebleContainer } from '../../../components/HidebleContainer';
import { VideoFeedProvider } from '../../../components/VideoFeed';
import { useVideosInfiniteQuery } from '../../../components/VideoFeed/hooks';
import { TileListBlock } from '../../../components/StateFeed/TileListBlock.tsx';
import { generateBlocks } from '../../../components/StateFeed/helpers/generateBlocks.ts';
import { VideoTiles } from '../../../components/VideoTiles/VideoTiles.tsx';

export const TabForYouScreen = () => {
  const cacheKey = useMemo(() => ['for_you_videos'], []);

  const controllers = useVideosInfiniteQuery({
    cacheKey,
    orderBy: { createdAt: 'desc' },
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
