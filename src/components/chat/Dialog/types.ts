export interface ChatMessage {
    id: string;
    sender: string;
    text: string;
    timestamp: string;
    isUser: boolean;
    avatar?: string;
}
