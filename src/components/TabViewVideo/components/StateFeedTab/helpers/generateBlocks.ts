import { BlockType, VideoItemType } from '../components/RenderVideo/types';

export const generateBlocks = (videos: VideoItemType[]): BlockType[] => {
    const blocks: BlockType[] = [];
    let i = 0;
    let toggle = true;

    while (i + 3 <= videos.length) {
        blocks.push({
            type: toggle ? 'leftSmall_rightBig' : 'leftBig_rightSmall',
            items: [videos[i], videos[i + 1], videos[i + 2]],
        });
        toggle = !toggle;
        i += 3;
    }

    // Якщо залишаються відео, додайте їх як окремі блоки
    while (i < videos.length) {
        blocks.push({
            type: 'single',
            items: [videos[i]],
        });
        i++;
    }

    return blocks;
};
// export const generateBlocks = (videos: VideoItemType[]): BlockType[] => {
//     const blocks: BlockType[] = [];
//     let i = 0;
//     let toggle = true;

//     while (i + 5 <= videos.length) {
//         blocks.push({
//             type: toggle ? 'leftSmall_rightBig' : 'leftBig_rightSmall',
//             items: [videos[i], videos[i + 1], videos[i + 2], videos[i + 3], videos[i + 4]],
//         });
//         toggle = !toggle;
//         i += 5;
//     }

//     // if 1-2 videos left
//     while (i < videos.length) {
//         blocks.push({
//             type: 'single',
//             items: [videos[i]],
//         });
//         i++;
//     }

//     return blocks;
// };
