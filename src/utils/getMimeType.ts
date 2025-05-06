export const getMimeType = (fileUri: string) => {
    const extension = fileUri.split('.').pop()?.toLowerCase();
    switch (extension) {
        case 'mov':
            return { type: 'video/quicktime', name: 'video.mov' };
        case 'mp4':
            return { type: 'video/mp4', name: 'video.mp4' };
        default:
            return { type: 'video/mp4', name: 'video.mp4' }; // default fallback
    }
};
