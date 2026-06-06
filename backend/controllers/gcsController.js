const { listVideosInFolder , getVideoPublicUrl } = require('../utils/gcsUtils');

async function getVideos(req, res) {
  const { folderName } = req.params;
  try {
    const bucketName = process.env.bucketName;
    const videos = await listVideosInFolder(bucketName, folderName);
    res.status(200).json({ videos });
  } catch (error) {
    console.error('Error fetching videos:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function getVideoUrl(req, res) {
    const { folderName, fileName } = req.params;
    try {
    const bucketName = process.env.bucketName;
    const decodedFileName = decodeURIComponent(fileName);
    if (!decodedFileName || !decodedFileName ) throw new Error("Missing parameters");
      const videoUrl = await getVideoPublicUrl(bucketName, folderName, decodedFileName);
      if (videoUrl) {
        res.status(200).json({ videoUrl });
      } else {
        res.status(404).json({ error: 'Video not found' });
      }
    } catch (error) {
      console.error('Error fetching video URL:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = { getVideos , getVideoUrl };
