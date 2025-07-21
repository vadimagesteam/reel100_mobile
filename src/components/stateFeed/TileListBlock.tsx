import { View, Dimensions, StyleSheet } from 'react-native';
import { VideoTile } from '../videoTiles';
import { TileBlock } from './helpers/generateBlocks';
import { VideoPost } from '../videoFeed/queries/apiVideosFetcher';

const { width: screenWidth } = Dimensions.get('window');
const half = screenWidth / 2;

export interface RenderBlockProp<T = TileBlock<VideoPost>> {
  item: T;
  index: number;
  onVideoPress: (video: VideoPost) => void;
}

const renderVideo = (
  onVideoPress: RenderBlockProp['onVideoPress'],
  item: VideoPost,
  style: any,
  uniqueKey: string,
) => {
  return (
    <VideoTile
      key={uniqueKey}
      style={style}
      index={0}
      className="mb-0 mr-0 rounded-none"
      item={item}
      onVideoPress={onVideoPress}
    />
  );
};

export const TileListBlock = ({
  item: block,
  index: blockIndex,
  onVideoPress,
}: RenderBlockProp) => {
  const { type, items } = block;

  if (type === 'leftSmall_rightBig') {
    return (
      <View className="flex-row">
        <View>
          {items
            .slice(0, 2)
            .map((item, index) =>
              renderVideo(onVideoPress, item, styles.smallBox, `${blockIndex}-${index}-${item.id}`),
            )}
        </View>
        {items[2] &&
          renderVideo(onVideoPress, items[2], styles.bigBox, `${blockIndex}-2-${items[2].id}`)}
      </View>
    );
  }

  if (type === 'leftBig_rightSmall') {
    return (
      <View className="flex-row">
        {renderVideo(onVideoPress, items[0], styles.bigBox, `${blockIndex}-0-${items[0].id}`)}
        <View>
          {items
            .slice(1, 3)
            .map((item, index) =>
              renderVideo(
                onVideoPress,
                item,
                styles.smallBox,
                `${blockIndex}-${index + 1}-${item.id}`,
              ),
            )}
        </View>
      </View>
    );
  }

  return renderVideo(
    onVideoPress,
    items[0],
    { width: screenWidth, height: half },
    `${blockIndex}-fallback-${items[0].id}`,
  );
};

export const styles = StyleSheet.create({
  smallBox: {
    width: half,
    height: half,
    marginRight: 0.5,
    marginBottom: 0.5,
  },
  bigBox: {
    width: half,
    height: half * 2,
    marginRight: 0.5,
    marginBottom: 0,
  },
});
