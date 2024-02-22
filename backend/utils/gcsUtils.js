const { Storage } = require('@google-cloud/storage');

const storage = new Storage();

async function listVideosInFolder(bucketName, folderName) {
  try {
    const [files] = await storage.bucket(bucketName).getFiles({
      prefix: folderName + '/',
    });

    return files.map(file => file.name);
  } catch (error) {
    console.error('Error listing videos:', error);
    return [];
  }
}

async function getVideoPublicUrl(bucketName, folderName, fileName) {
  try {
    const [metadata] = await storage
      .bucket(bucketName)
      .file(`${folderName}/${fileName}`)
      .getMetadata();

    return metadata.mediaLink;
  } catch (error) {
    console.error('Error fetching video URL:', error);
    return null;
  }
}

module.exports = { listVideosInFolder, getVideoPublicUrl };
