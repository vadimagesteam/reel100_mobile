import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FlatList, StyleSheet, TextInput, TouchableOpacity, View, Platform, KeyboardAvoidingView, Image, ListRenderItem } from 'react-native';
import { BodyText } from '../UI';
import { RootState, useReduxDispatch, useReduxSelector } from '../../store/store';
import { createVideoCommentAction, getVideoCommentsAction } from '../../redux/VideoRedux/videoAction';
import { colors, positionHelpers } from '../../styles';
import { formatTimeAgo } from '../../utils/formatTime';
import { CommentType } from '../../redux/VideoRedux/types';

type CommentSectionProps = {
    videoId: string;
    userMeId: string | undefined
    onClose: () => void;
};

const CommentSection = ({ videoId, userMeId, onClose }: CommentSectionProps) => {
    const dispatch = useReduxDispatch();
    const { videoComments } = useReduxSelector((state: RootState) => state.video);
    const inputRef = useRef<TextInput>(null);
    const [newComment, setNewComment] = useState('');
    const [replyToCommentId, setReplyToCommentId] = useState<string | null>(null);
    const [replyingToUser, setReplyingToUser] = useState<string | null>(null);
    const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set());
    // const [skip, setSkip] = useState(0);
    // const take = 10;

    useEffect(() => {
        dispatch(getVideoCommentsAction({ videoId, userId: userMeId }));
    }, []);


    console.log('videoComments--->', videoComments);
    const postComment = () => {
        if (!newComment.trim()) { return; }

        const dataComment = {
            commentData: {
                replyTo: replyToCommentId || '',
                text: newComment,
                user: {
                    id: userMeId,
                },
                video: {
                    id: videoId,
                },
            },
            setNewComment,
            setReplyToCommentId,
            setReplyingToUser,

        };
        dispatch(createVideoCommentAction(dataComment));

        setTimeout(() => inputRef.current?.blur(), 100);
    };

    const toggleReplies = (commentId: string) => {
        setExpandedComments(prev => {
            const newSet = new Set(prev);
            if (newSet.has(commentId)) {
                newSet.delete(commentId);
            } else {
                newSet.add(commentId);
            }
            return newSet;
        });
    };

    const buildCommentTree = (comments: CommentType[]): CommentType[] => {
        const commentMap: Record<string, CommentType & { replies: CommentType[] }> = {};
        const rootComments: CommentType[] = [];

        comments.forEach(comment => {
            commentMap[comment.id] = { ...comment, replies: [] };
        });

        comments.forEach(comment => {
            if (comment.replyTo) {
                const parent = commentMap[comment.replyTo];
                if (parent) {
                    parent.replies.push(commentMap[comment.id]);
                }
            } else {
                rootComments.push(commentMap[comment.id]);
            }
        });

        return rootComments;
    };

    const flatListComments = (comments: CommentType[], level = 0): CommentType[] => {
        let flat: CommentType[] = [];

        for (const comment of comments) {
            flat.push({ ...comment, level });
            if (comment.replies?.length) {
                flat = flat.concat(flatListComments(comment.replies, level + 1));
            }
        }

        return flat;
    };

    const structuredComments = useMemo(() => buildCommentTree(videoComments), [videoComments]);
    const flatComments = useMemo(() => flatListComments(structuredComments), [structuredComments]);

    const visibleFlatComments: (CommentType & { level?: number })[] = useMemo(() => {
        const visible: (CommentType & { level?: number })[] = [];
        const allowedParents = new Set<string>();

        flatComments.forEach(comment => {
            if (comment.level === 0) {
                visible.push(comment);
                if (expandedComments.has(comment.id)) {
                    allowedParents.add(comment.id);
                }
            } else if (allowedParents.has(comment.replyTo || '')) {
                visible.push(comment);
            }
        });

        return visible;
    }, [flatComments, expandedComments]);

    const handleReplyPress = useCallback((comment: CommentType) => {
        setReplyToCommentId(comment.id);
        setReplyingToUser(`${comment?.user?.firstName} ${comment?.user?.lastName}`);
        setTimeout(() => inputRef.current?.focus(), 100);

        setExpandedComments(prev => {
            const newSet = new Set(prev);
            newSet.add(comment.id);
            return newSet;
        });
    }, []);

    const renderFlatComment: ListRenderItem<any> = ({ item }) => {
        return (
            <View style={{ marginLeft: item.level * 20, marginTop: 10 }}>
                <View style={[styles.commentItem, { flexDirection: 'row', justifyContent: 'space-between' }]}>
                    <View>
                        <View style={[positionHelpers.alignItemsCenterRow]}>
                            <Image
                                source={{ uri: 'https://cdn-icons-png.flaticon.com/512/9203/9203764.png' }}
                                style={{ height: 30, width: 30 }}
                            />
                            <BodyText fontWeight={'bold'} marginLeft={5} fontSize={16} color={colors.silver4}>
                                {`${item?.user?.firstName} ${item?.user?.lastName}`}
                            </BodyText>
                        </View>
                        <View style={{ marginLeft: 45 }}>
                            <BodyText style={styles.text}>{item?.text}</BodyText>
                        </View>
                    </View>
                    <BodyText fontSize={9} color={colors.white}>{formatTimeAgo(item?.createdAt)}</BodyText>
                </View>

                {item.level === 0 && (
                    <View style={positionHelpers.rowFillCenter}>
                        <TouchableOpacity
                            onPress={() => handleReplyPress(item)}
                        >
                            <BodyText color={colors.white}>Reply</BodyText>
                        </TouchableOpacity>
                        {item.replies?.length > 0 && (
                            <TouchableOpacity
                                onPress={() => {
                                    toggleReplies(item.id);
                                }}
                                style={{ flexDirection: 'row', alignItems: 'center' }}
                            >
                                <BodyText color={colors.silver4} marginLeft={5}>
                                    {item.replies.length} Comments
                                </BodyText>
                            </TouchableOpacity>
                        )}
                    </View>
                )}
            </View>
        );
    };



    return (
        <KeyboardAvoidingView
            style={{ flex: 2.5 }}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            {/* <TouchableWithoutFeedback onPress={Keyboard.dismiss}> */}
            <View style={{ flex: 1, backgroundColor: colors.black }}>
                <View style={styles.header}>
                    <BodyText fontSize={16} color={colors.white} fontWeight={'bold'}>{videoComments?.length} Comments</BodyText>
                    <TouchableOpacity onPress={onClose}>
                        <BodyText fontSize={18} color={colors.white}>✕</BodyText>
                    </TouchableOpacity>
                </View>

                <View
                    style={positionHelpers.fill}
                >
                    {/* {
                        loading ? <LoaderIndicator /> : (
                            <> */}
                    {videoComments?.length === 0 ? (
                        <View style={styles.emptyContainer}>
                            <BodyText fontSize={14} color={colors.white}>Comments will appear here</BodyText>
                        </View>
                    ) : (
                        <FlatList
                            data={visibleFlatComments}
                            keyExtractor={(item) => item.id}
                            renderItem={renderFlatComment}
                            contentContainerStyle={{ padding: 16 }}
                            keyboardShouldPersistTaps="handled"
                            showsVerticalScrollIndicator={false}
                        />
                    )}
                    {/* </>
                        )
                    } */}

                </View>

                {replyToCommentId && (
                    <View style={[positionHelpers.rowFillCenter, { paddingHorizontal: 10, padding: 10, backgroundColor: colors.black1 }]}>
                        <BodyText color={colors.silver4}>Replying to {replyingToUser}</BodyText>
                        <TouchableOpacity onPress={() => {
                            setReplyToCommentId(null);
                            setReplyingToUser(null);
                            setTimeout(() => inputRef.current?.blur(), 100);
                        }}>
                            <BodyText color={colors.white} marginLeft={10}>✕ Cancel</BodyText>
                        </TouchableOpacity>
                    </View>
                )}

                <View style={styles.inputContainer}>
                    <TextInput
                        ref={inputRef}
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
            {/* </TouchableWithoutFeedback> */}
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
        marginBottom: 5,
        padding: 10,
        borderRadius: 10,
        backgroundColor: '#1c1c1b',
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
