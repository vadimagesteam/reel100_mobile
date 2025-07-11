import { Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const ItemMargin = 4;
const NumColumns = 3;

export const TileConfig = {
  ItemMargin,
  NumColumns,
  ItemSize: (width - ItemMargin * (NumColumns + 1) - 14) / NumColumns,
} as const;
