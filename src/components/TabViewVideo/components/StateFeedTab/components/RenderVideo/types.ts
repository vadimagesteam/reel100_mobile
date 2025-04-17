export type VideoItemType = {
    id: string;
    avatar: string;
    fullname: string;
    list_number: string;
    like_count: string;
    uri: string;
};

export type BlockLayoutType = 'leftSmall_rightBig' | 'leftBig_rightSmall' | 'single';

export type BlockType = {
    type: BlockLayoutType;
    items: VideoItemType[];
};
