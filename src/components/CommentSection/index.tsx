import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, TextInput, TouchableOpacity, View, Platform, Modal, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView } from 'react-native';
import { BodyText } from '../UI';
import { useReduxDispatch } from '../../store/store';
import { createVideoCommentAction, getVideoCommentsAction } from '../../redux/VideoRedux/videoAction';
import { isIOS } from '../../utils/platformChecker';
import { colors, positionHelpers } from '../../styles';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';


type CommentSectionProps = {
    videoId: string;
    onClose: () => void;
};

const CommentSection = ({ videoId, onClose }: CommentSectionProps) => {
    const dispatch = useReduxDispatch();
    const [comments, setComments] = useState<any[]>([]);
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

    return (
        <>
            <View style={styles.header}>
                <BodyText fontSize={16} color={colors.white} fontWeight={'bold'}>Comments</BodyText>
                <TouchableOpacity onPress={onClose}>
                    <BodyText fontSize={18} color={colors.white}>✕</BodyText>
                </TouchableOpacity>
            </View>
            <KeyboardAwareScrollView
                enableOnAndroid
                extraScrollHeight={20}
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={{ flexGrow: 1 }}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={positionHelpers.fill}>
                        <View style={styles.container}>

                            <FlatList
                                data={comments}
                                keyExtractor={(item) => item.id}
                                renderItem={({ item }) => (
                                    <View style={styles.commentItem}>
                                        <BodyText style={styles.user}>{item.user.fullname}</BodyText>
                                        <BodyText style={styles.text}>{item.text}</BodyText>
                                    </View>
                                )}
                                contentContainerStyle={{ padding: 16 }}
                            />
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
                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAwareScrollView>
        </>
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
});
