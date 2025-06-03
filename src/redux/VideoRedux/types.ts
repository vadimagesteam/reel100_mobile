export interface VideoState {
    loading: boolean;
    videoComments: CommentType[]
    oneVideoData: any[]
    error: Error | null;
}


export type CommentType = {
    id: string;
    text: string;
    createdAt: string;
    updatedAt: string;
    replyTo?: string;
    user: {
        id: string;
        firstName: string;
        lastName: string;
    };
    video: {
        id: string;
    };
    replies?: CommentType[] | undefined; // додається під час побудови дерева
    level?: number | undefined;          // додається під час флета
};
