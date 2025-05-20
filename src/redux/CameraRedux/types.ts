export interface CameraState {
    loading: boolean;
    customLoading: boolean
    videos: VideoItemType[]
    userVideos: VideoItemType[]
    videosMeData: VideoItemType[]
    prewievVideoUrl: string
    error: Error | null;
}

export interface VideoItemType {
    id: string;
    label: string;
    slug: string;
    createdAt: string;
    updatedAt: string;
    file: VideoFileType | null;
    user: {
        id: string;
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
