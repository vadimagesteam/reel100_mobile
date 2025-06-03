export interface ChatMessage {
    id: string;
    sender: string;
    text: string;
    timestamp: string;
    isUser: boolean;
    avatar?: string;
}


export interface ChatPreview {
    id: string;
    lastMessage: string;
    timestamp: string;
    avatar: string;
    unreadCount?: number;
    firstName: string,
    lastName: string
}
