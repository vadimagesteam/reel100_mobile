import { RefObject, useLayoutEffect, useRef } from 'react';
import { sleep } from '../../../../utils/promise.ts';
import { CommentType } from './useCommentsInfiniteQuery.ts';
import { BottomSheetFlatListMethods } from '@gorhom/bottom-sheet';

/**
 * This is very basic implementation of scrolling in to very deep element inside FlatList
 * Here is the logic: once optimistic comment is added:
 *  - find index
 *  - calculate the offset based on all the prev comments: offset=commentSize(76,90) * index - 1
 *  - scroll by chunks because due to optimizations not all the comments could be visible
 *
 *  Ideas to improve:
 *   - calculate approx position of the new comment before submit (new comment: offset=0, thread: thread_pos + thread_comments_offset)
 *   - do not show all the thread...usually no one needs all thread comments (Instagram, TikTok way)
 */

const CommentBottomOffset = 10;
const ApproxCommentRootHeight = 90;
const ApproxReplyCommentHeight = 67;

const chunkSteps = (num: number, step: number = 1000): number[] =>
  Array.from({ length: Math.ceil(num / step) }, (_, i) => Math.min((i + 1) * step, num));

export const useScrollToNewComment = (
  listRef: RefObject<BottomSheetFlatListMethods | null>,
  allComments: CommentType[],
  commentsTree: CommentType[],
  onDone?: () => void,
) => {
  const firstIteration = useRef(true);
  useLayoutEffect(() => {
    if (!firstIteration.current && allComments[0]?.id.startsWith('optimistic')) {
      let idx = commentsTree.findIndex((c) => c.id.startsWith('optimistic'));

      if (idx === 0) {
        listRef.current?.scrollToOffset({ offset: 0, animated: false });
        return;
      }

      let offset = 0;
      while (idx-- > 0) {
        offset +=
          CommentBottomOffset +
          (commentsTree[idx].replyTo ? ApproxReplyCommentHeight : ApproxCommentRootHeight);
      }

      const chunks = chunkSteps(offset - 50);

      const scrollChunks = async () => {
        for (let chunk of chunks) {
          listRef.current?.scrollToOffset({ offset: chunk, animated: true });
          await sleep(100);
        }
      };
      scrollChunks().then(() => onDone?.());
    }
    firstIteration.current = false;
  }, [allComments, commentsTree, onDone, listRef]);
};
