export interface CameraState {
    loading: boolean;
    customLoading: boolean
    videos: any[]
    userVideos: any[]
    prewievVideoUrl: string
    error: Error | null;
}
