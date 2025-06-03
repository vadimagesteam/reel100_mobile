export interface CameraState {
    loading: boolean;
    customLoading: boolean
    videos: VideoItemType[]
    videosTop100: VideoItemType[]
    userVideos: VideoItemType[]
    videosMeData: VideoItemType[]
    prewievVideoUrl: string
    page: number;
    hasMore: boolean;
    loadingTopTab: boolean
    error: Error | null;
}

export interface VideoItemType {
    id: string;
    label: string;
    slug: string;
    createdAt: string;
    updatedAt: string;
    file: VideoFileType | null;
    commentsCount: number
    likesCount: number
    user: {
        firstName: string
        id: string;
        lastName: string
    };
}

export interface VideoFileType {
    encoding: string;
    filename: string;
    metadata: {
        size: number;
        directory: string;
    };
    mimetype: string;
    storagePath: string;
    uuid: string;
    variation: VideoVariationType[] | null;
}

export interface VideoVariationType {
    path: string;
    quality: string;
    aspectRatio: string;
    format: string;
    fps: number;
    height: number;
    width: number;
    qualityType: string;
    screenshots: string[];
}


export type GetVideosParams = {
    userId?: string | undefined;
    skip?: number;
    take?: number;
    orderBy?: Record<string, 'asc' | 'desc'>;
    where?: Record<string, any>;
};
