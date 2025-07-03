export type BlockType = 'leftSmall_rightBig' | 'leftBig_rightSmall' | 'single';
export type TileBlock<T> = {
  type: BlockType;
  items: T[];
};

export const generateBlocks = <T>(videos: T[]): TileBlock<T>[] => {
  const blocks: TileBlock<T>[] = [];
  let i = 0;
  let toggle = true;

  while (i + 3 <= videos.length) {
    blocks.push({
      type: toggle ? 'leftSmall_rightBig' : 'leftBig_rightSmall',
      items: [videos[i], videos[i + 1], videos[i + 2]],
    });
    toggle = !toggle;
    i += 3;
  }

  while (i < videos.length) {
    blocks.push({
      type: 'single',
      items: [videos[i]],
    });
    i++;
  }

  return blocks;
};
