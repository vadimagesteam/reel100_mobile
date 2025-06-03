import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FlatList, TextInput, TouchableOpacity, View, Platform, KeyboardAvoidingView, Image, ListRenderItem } from 'react-native';
import { BodyText, LoaderIndicator } from '../UI';
import { RootState, useReduxDispatch, useReduxSelector } from '../../store/store';
import { createVideoCommentAction, getVideoCommentsAction } from '../../redux/VideoRedux/videoAction';
import { colors, positionHelpers } from '../../styles';
import { formatTimeAgo } from '../../utils/formatTime';
import { CommentType } from '../../redux/VideoRedux/types';
import { cs } from './styles';

type CommentSectionProps = {
    videoId: string;
    userId: string | undefined
    onClose: () => void;
};

const CommentSection = ({ videoId, userId, onClose }: CommentSectionProps) => {
    const dispatch = useReduxDispatch();
    const { videoComments } = useReduxSelector((state: RootState) => state.video);
    const inputRef = useRef<TextInput>(null);
    const [newComment, setNewComment] = useState('');
    const [replyToCommentId, setReplyToCommentId] = useState<string | null>(null);
    const [replyingToUser, setReplyingToUser] = useState<string | null>(null);
    const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set());
    // const [skip, setSkip] = useState(0);
    // const take = 10;
    const [initialLoading, setInitialLoading] = useState(true);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setInitialLoading(false);
        }, 800);
        return () => clearTimeout(timeout);
    }, []);

    useEffect(() => {
        dispatch(getVideoCommentsAction({ videoId, userId }));
    }, []);

    const postComment = () => {
        if (!newComment.trim()) { return; }

        const dataComment = {
            commentData: {
                replyTo: replyToCommentId || '',
                text: newComment,
                user: {
                    id: userId,
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
            <View style={[positionHelpers.mt10, { marginLeft: item.level * 20 }]}>
                <View style={[positionHelpers.rowFill, cs.commentItem]}>
                    <View>
                        <View style={[positionHelpers.alignItemsCenterRow]}>
                            <Image
                                source={{ uri: 'https://cdn-icons-png.flaticon.com/512/9203/9203764.png' }}
                                style={cs.avatarStyle}
                            />
                            <BodyText fontWeight={'bold'} marginLeft={5} fontSize={16} color={colors.silver4}>
                                {`${item?.user?.firstName} ${item?.user?.lastName}`}
                            </BodyText>
                        </View>
                        <View style={cs.ml45}>
                            <BodyText color={colors.silver1}>{item?.text}</BodyText>
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
                                style={positionHelpers.alignItemsCenterRow}
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
            style={cs.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >

            <View style={[positionHelpers.fill, { backgroundColor: colors.black }]}>
                <View style={cs.header}>
                    <BodyText fontSize={16} color={colors.white} fontWeight={'bold'}>{videoComments?.length} Comments</BodyText>
                    <TouchableOpacity onPress={onClose}>
                        <BodyText fontSize={18} color={colors.white}>✕</BodyText>
                    </TouchableOpacity>
                </View>

                <View
                    style={positionHelpers.fill}
                >
                    {initialLoading ?
                        <LoaderIndicator /> : (
                            <>
                                {videoComments?.length === 0 ? (
                                    <View style={cs.emptyContainer}>
                                        <BodyText fontSize={14} color={colors.white}>Comments will appear here</BodyText>
                                    </View>
                                ) : (
                                    <FlatList
                                        data={visibleFlatComments}
                                        keyExtractor={(item) => item.id}
                                        renderItem={renderFlatComment}
                                        contentContainerStyle={cs.p16}
                                        keyboardShouldPersistTaps="handled"
                                        showsVerticalScrollIndicator={false}
                                    />
                                )}
                            </>)}
                </View>

                {replyToCommentId && (
                    <View style={[positionHelpers.rowFillCenter, cs.replayCommentContainer]}>
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

                <View style={cs.inputContainer}>
                    <TextInput
                        ref={inputRef}
                        style={cs.input}
                        placeholder="Add a comment..."
                        placeholderTextColor="#aaa"
                        value={newComment}
                        onChangeText={setNewComment}
                    />
                    <TouchableOpacity
                        onPress={postComment}
                        style={cs.sendButton}
                    >
                        <BodyText fontWeight={'bold'} color={colors.white}>Send</BodyText>
                    </TouchableOpacity>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
};

export default CommentSection;

