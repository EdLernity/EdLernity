function extractS3Key(url) {
    // Split the URL by '/'
    const parts = url.split('/');
    // The key is typically after the bucket name
    // It's everything after the third '/' in the URL
    const keyParts = parts.slice(3);
    // Join the key parts back together with '/' to form the key
    const key = keyParts.join('/');
    return key;
}

module.exports = { extractS3Key };
