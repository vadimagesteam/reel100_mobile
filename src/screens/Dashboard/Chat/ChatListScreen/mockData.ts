import { ChatPreview } from './types';

export const mockChatList: ChatPreview[] = [
    {
        id: '1',
        firstName: 'Alice',
        lastName: 'Gorin',
        lastMessage: 'Hello, How are you?',
        timestamp: '2025-05-26T10:03:00Z',
        avatar: '',
        unreadCount: 2,
    },
    {
        id: '2',
        firstName: 'Bogdan',
        lastName: 'Gorin',
        lastMessage: 'ok bro',
        timestamp: '2025-05-26T09:40:00Z',
        avatar: '',
    },
    {
        id: '3',
        firstName: 'Katy',
        lastName: 'Gorin',
        lastMessage: 'Thanks',
        timestamp: '2025-05-25T18:12:00Z',
        avatar: '',
    },
];
