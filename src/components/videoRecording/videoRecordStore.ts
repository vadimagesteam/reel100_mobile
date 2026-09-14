import { toast } from '@backpackapp-io/react-native-toast';
import { create } from 'zustand';
import { api } from '../../lib/api';
import { captionTitle, getMimeType } from '../../utils';

export type VideoRecordStore = {
  previewUri: string | null;
  isPreviewReady: boolean;
  error: Error | null;
  uploading: boolean;
  uploadProgress: number;

  actions: {
    clear: () => void;
    setPreviewUri: (uri: string) => void;
    setIsPreviewReady: (ready: boolean) => void;
    publish: (stateId: string, description: string, tags?: string[]) => Promise<boolean>;
  };
};

export const useVideoRecordStore = create<VideoRecordStore>((set, get) => ({
  previewUri: null,
  isPreviewReady: false,
  error: null,
  uploading: false,
  uploadProgress: 0,

  actions: {
    clear: () => {
      set({
        previewUri: null,
        isPreviewReady: false,
        error: null,
        uploading: false,
        uploadProgress: 0,
      });
    },
    setPreviewUri: (uri) => set({ previewUri: uri }),
    setIsPreviewReady: (ready) => set({ isPreviewReady: ready }),

    publish: async (stateId, description, tags) => {
      const { previewUri } = get();

      if (!previewUri) {
        throw new Error('Nothing to publish');
      }

      const fileName = previewUri
        .split('/')
        .pop()
        ?.replace(/\.[^/.]+$/, '');

      // Nothing asks the author for a title, so the caption doubles as one.
      // Without this the label is the recording's file name — a UUID on iOS,
      // VID_20260830_141233 on Android — which is what search results were
      // listing as video names.
      const label = captionTitle(description) || fileName;

      const metaDataPayload = {
        label,
        description,
        states: {
          connect: { id: stateId },
        },
      };

      try {
        set({ uploading: true, error: null, uploadProgress: 0 });
        const response = await api.post('api/videos', metaDataPayload);

        if (response?.status === 201 && response.data?.id) {
          const videoId = response.data.id;

          // Attach tags (best-effort): a failure here shouldn't abort the
          // upload — the video still publishes without them. It is said out
          // loud, though: this used to fail into a console line nobody sees,
          // so a video would post untagged and the author would only find out
          // by searching for their hashtag and finding nothing.
          if (tags && tags.length > 0) {
            try {
              await api.put(`api/tags/video/${videoId}`, { tags });
            } catch (e) {
              console.error('Failed to attach tags to video', e);
              toast.error('Your video posted, but its hashtags could not be saved.');
            }
          }

          const { type, name } = getMimeType(previewUri);
          const fileUri = previewUri.startsWith('file://') ? previewUri : `file://${previewUri}`;

          const formData = new FormData();
          formData.append('file', {
            uri: fileUri,
            type,
            name,
          } as any); // as any required by RN FormData type

          const fileUploadResponse = await api.put(`api/videos/${videoId}/file`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
            onUploadProgress: (progressEvent) => {
              if (progressEvent.total) {
                const progress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
                set({ uploadProgress: progress });
              }
            },
          });

          console.log('VIDEO FILE UPLOAD RESPONSE', response);
          if (fileUploadResponse.status === 200) {
            set({ uploading: false });
            return true;
          }
        }
      } catch (error: any) {
        set({ error });
      }

      return false;
    },
  },
}));

export const useVideoRecordingPreview = () => {
  return {
    isPreviewReady: useVideoRecordStore((s) => s.isPreviewReady),
    previewUri: useVideoRecordStore((s) => s.previewUri),
    setPreviewUri: useVideoRecordStore((s) => s.actions.setPreviewUri),
    setIsPreviewReady: useVideoRecordStore((s) => s.actions.setIsPreviewReady),
  };
};
