import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, TextInput, TouchableOpacity, View, Platform, Modal, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView, Dimensions } from 'react-native';
import { BodyText } from '../UI';
import { useReduxDispatch, useReduxSelector } from '../../store/store';
import { createVideoCommentAction, getVideoCommentsAction } from '../../redux/VideoRedux/videoAction';
import { isIOS } from '../../utils/platformChecker';
import { colors, positionHelpers } from '../../styles';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const { height } = Dimensions.get('window');

type CommentSectionProps = {
    videoId: string;
    onClose: () => void;
};

const CommentSection = ({ videoId, onClose }: CommentSectionProps) => {
    const dispatch = useReduxDispatch();
    const { videoComments } = useReduxSelector(state => state.video);
    const [newComment, setNewComment] = useState('');

    useEffect(() => {
        dispatch(getVideoCommentsAction(videoId));
    }, []);

    const postComment = () => {
        if (!newComment.trim()) { return; }

        dispatch(createVideoCommentAction({
            videoId,
            bodyComment: [newComment],
        }));
    };

    const renderItem = ({ item }) => {
        console.log('item-->', item);
        return (
            <View style={styles.commentItem}>
                {/* <BodyText style={styles.user}>{item.user?.fullname}</BodyText>
                <BodyText style={styles.text}>{item.text}</BodyText> */}
            </View>
        );
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 2.5, height: height * 0.7 }}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={{ flex: 1, backgroundColor: colors.black }}>
                    <View style={styles.header}>
                        <BodyText fontSize={16} color={colors.white} fontWeight={'bold'}>Comments</BodyText>
                        <TouchableOpacity onPress={onClose}>
                            <BodyText fontSize={18} color={colors.white}>✕</BodyText>
                        </TouchableOpacity>
                    </View>

                    <View style={{ flex: 1 }}>
                        {videoComments?.length === 0 ? (
                            <View style={styles.emptyContainer}>
                                <BodyText fontSize={14} color={colors.white}>Comments will appear here</BodyText>
                            </View>
                        ) : (
                            <FlatList
                                data={videoComments}
                                keyExtractor={(item) => item.id}
                                renderItem={renderItem}
                                contentContainerStyle={{ padding: 16 }}
                                keyboardShouldPersistTaps="handled"
                                showsVerticalScrollIndicator={false}
                            />
                        )}
                    </View>

                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="Add a comment..."
                            placeholderTextColor="#aaa"
                            value={newComment}
                            onChangeText={setNewComment}
                        />
                        <TouchableOpacity
                            onPress={postComment}
                            style={styles.sendButton}
                        >
                            <BodyText fontWeight={'bold'} color={colors.white}>Send</BodyText>
                        </TouchableOpacity>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
};

export default CommentSection;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#111',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#222',
    },
    commentItem: {
        marginBottom: 12,
    },
    user: {
        fontWeight: '600',
        color: '#fff',
    },
    text: {
        color: '#ccc',
    },
    inputContainer: {
        // position: 'absolute',
        // bottom: 0,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        borderTopWidth: 1,
        borderTopColor: '#333',
        paddingBottom: 25,
        backgroundColor: colors.black1,
    },
    input: {
        flex: 1,
        height: 40,
        backgroundColor: '#222',
        borderRadius: 20,
        paddingHorizontal: 12,
        color: '#fff',
    },
    sendButton: {
        marginLeft: 8,
        backgroundColor: colors.blue,
        borderRadius: 20,
        paddingHorizontal: 14,
        paddingVertical: 8,
    },

    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,

    },
});
