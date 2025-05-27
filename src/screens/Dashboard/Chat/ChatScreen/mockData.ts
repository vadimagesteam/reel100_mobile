import { ChatMessage } from './types';

export const mockChatMessages: ChatMessage[] = [
    {
        id: '1',
        sender: 'Alice',
        text: 'Hello! How are you',
        timestamp: '2025-05-26T10:00:00Z',
        isUser: false,
        avatar: '',
    },
    {
        id: '2',
        sender: 'Me',
        text: 'Hello, good! How are you?',
        timestamp: '2025-05-26T10:01:00Z',
        isUser: true,
    },
    {
        id: '3',
        sender: 'Alice',
        text: "Good. Let's go to park?",
        timestamp: '2025-05-26T10:02:30Z',
        isUser: false,
        avatar: '',
    },
    {
        id: '4',
        sender: 'Me',
        text: 'Yes, I like to walk park',
        timestamp: '',
        isUser: true,
    },
    {
        id: '5',
        sender: 'Alice',
        text: 'Super',
        timestamp: '2025-05-26T10:04:00Z',
        isUser: false,
        avatar: '',
    },
];
