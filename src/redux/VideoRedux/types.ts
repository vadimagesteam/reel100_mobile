export interface VideoState {
    loading: boolean;
    videoComments: any[]
    oneVideoData: any[]
    countComments: number | null
    error: Error | null;
}
