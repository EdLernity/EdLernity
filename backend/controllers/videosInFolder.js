const { Storage } = require('@google-cloud/storage');

// Create a new instance of the Storage client
const storage = new Storage();

async function listVideosInFolder(bucketName, folderName) {
  try {
    // List files in the bucket with the specified prefix (folder name)
    const [files] = await storage.bucket(bucketName).getFiles({
      prefix: folderName + '/',
    });

    // Extract the names of the files from the list of objects
    const videoNames = files.map((file) => file.name);

    // Filter out files that are not videos (e.g., based on file extension)
    const videoFiles = videoNames.filter((name) => {
      // Adjust the condition based on the file extension of your videos
      return name.endsWith('.mp4') || name.endsWith('.avi');
    });

    return videoFiles;
  } catch (error) {
    console.error('Error listing videos:', error);
    return [];
  }
}

// Usage example
const bucketName = 'your-bucket-name';
const folderName = 'your-folder-name';
listVideosInFolder(bucketName, folderName)
  .then((videos) => {
    console.log('Videos in folder:', videos);
  })
  .catch((error) => {
    console.error('Error:', error);
  });
