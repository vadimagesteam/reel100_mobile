export interface LikesState {
    loading: boolean;
    likesData: LikeResponseType[]
    error: Error | null;
}

export type LikeResponseType = {
    id: string;
    typeField: 'Like';
    createdAt: string;
    updatedAt: string;
    user: {
        id: string;
    };
    video: {
        id: string;
    };
};

export type LikeBodyType = {
    dataLike: {
        typeField: 'Like' | string;
        user: {
            id: string;
        };
        video: {
            id: string;
        };
    }
};

export type ActionFieldType = 'Like'

export type GetLikesParams = {
    userId: string;
    videoId: string;
};

export type DeleteLikeParams = {
    id: string;
    userId: string;
    videoId: string;
};
