export const getMimeType = (fileUri: string) => {
  const extension = fileUri.split('.').pop()?.toLowerCase();

  switch (extension) {
    case 'jpg':
    case 'jpeg':
      return { type: 'image/jpeg', name: 'photo.jpg' };
    case 'png':
      return { type: 'image/png', name: 'photo.png' };
    case 'gif':
      return { type: 'image/gif', name: 'photo.gif' };
    case 'heic':
      return { type: 'image/heic', name: 'photo.heic' };

    case 'mp4':
      return { type: 'video/mp4', name: 'video.mp4' };
    case 'mov':
      return { type: 'video/quicktime', name: 'video.mov' };
    case 'avi':
      return { type: 'video/x-msvideo', name: 'video.avi' };
    case 'webm':
      return { type: 'video/webm', name: 'video.webm' };

    case 'mp3':
      return { type: 'audio/mpeg', name: 'audio.mp3' };
    case 'aac':
      return { type: 'audio/aac', name: 'audio.aac' };
    case 'wav':
      return { type: 'audio/wav', name: 'audio.wav' };

    case 'pdf':
      return { type: 'application/pdf', name: 'document.pdf' };
    case 'doc':
      return { type: 'application/msword', name: 'document.doc' };
    case 'docx':
      return {
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        name: 'document.docx',
      };

    default:
      return { type: 'application/octet-stream', name: 'file' };
  }
};
