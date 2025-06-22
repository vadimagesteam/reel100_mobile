// deleteComments.ts
import axios from 'axios';

const API_BASE = 'http://44.239.248.108/api';
const AUTH_TOKEN =
  'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjbWJ6MnJkYTMwMDFucXFmenQxdXRpZHJtIiwidXNlcm5hbWUiOiJhdy5oYW1lcit0ZXN0NEBnbWFpbC5jb20iLCJpYXQiOjE3NTAyODAzMzYsImV4cCI6MTc1MDQ1MzEzNn0.XcN4c3svn25bWq3Z2tROAOnONNuv2OvMFeUmpmOnXfE';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    Authorization: AUTH_TOKEN,
    'Content-Type': 'application/json',
  },
});

async function processVideos() {
  try {
    const { data: videos } = await api.get('/videos');

    for (const video of videos) {
      const videoId = video.id;
      console.log(`\n▶ Processing video: ${videoId}`);

      const { data: comments } = await api.get(`/videos/${videoId}/comments`);
      console.log(`Found ${comments.length} comments`);

      for (const comment of comments) {
        const commentId = comment.id;
        try {
          await api.delete(`/comments/${commentId}`);
          console.log(`  ❌ Deleted comment ${commentId}`);
        } catch (err: any) {
          console.error(`  ⚠️ Error deleting comment ${commentId}:`, err.message);
        }
      }

      try {
        await api.patch(`/videos/${videoId}`, { commentsCount: 0 });
        console.log(`  ✅ Reset commentsCount for video ${videoId}`);
      } catch (err: any) {
        console.error(`  ⚠️ Error resetting count for video ${videoId}:`, err.message);
      }
    }

    console.log('\n🎉 Done!');
  } catch (err: any) {
    console.error('Failed to process videos:', err.message);
  }
}

processVideos();
