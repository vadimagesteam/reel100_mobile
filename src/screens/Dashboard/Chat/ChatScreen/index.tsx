import React from 'react';
import { View, Text, FlatList, StyleSheet, Image } from 'react-native';
import { ChatMessage } from './types';
import { mockChatMessages } from './mockData';
import { colors } from '../../../../styles';

const ChatScreen = () => {
    const renderItem = ({ item }: { item: ChatMessage }) => {
        const isUser = item.isUser;

        return (
            <View
                style={[
                    styles.messageContainer,
                    isUser ? styles.userMessage : styles.otherMessage,
                ]}
            >
                {!isUser && item.avatar && (
                    <Image source={{ uri: item.avatar }} style={styles.avatar} />
                )}
                <View style={styles.bubble}>
                    <Text style={styles.sender}>{isUser ? 'Вы' : item.sender}</Text>
                    <Text style={styles.text}>{item.text}</Text>
                    <Text style={styles.timestamp}>{formatTime(item.timestamp)}</Text>
                </View>
            </View>
        );
    };

    const formatTime = (timestamp: string) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={mockChatMessages}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.list}
                inverted
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.black1,
    },
    list: {
        padding: 10,
    },
    messageContainer: {
        flexDirection: 'row',
        marginVertical: 6,
        alignItems: 'flex-end',
    },
    userMessage: {
        alignSelf: 'flex-end',
        flexDirection: 'row-reverse',
    },
    otherMessage: {
        alignSelf: 'flex-start',
    },
    avatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        marginRight: 8,
    },
    bubble: {
        maxWidth: '75%',
        padding: 10,
        borderRadius: 12,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 1,
    },
    sender: {
        fontSize: 12,
        color: '#888',
        marginBottom: 2,
    },
    text: {
        fontSize: 16,
        color: '#333',
    },
    timestamp: {
        fontSize: 10,
        color: '#aaa',
        marginTop: 4,
        alignSelf: 'flex-end',
    },
});

export default ChatScreen;
