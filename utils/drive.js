const { google } = require('googleapis');
const stream = require('stream');

/**
 * Uploads a base64 or buffer file to Google Drive.
 * @param {string} email - Service account email
 * @param {string} key - Private key
 * @param {string} folderId - Destination folder ID
 * @param {Buffer} fileBuffer - The file content
 * @param {string} fileName - Name of the file
 * @param {string} mimeType - MIME type of the file
 * @returns {Promise<string>} - The Google Drive file WebContentLink or WebViewLink
 */
exports.uploadToDrive = async (email, key, folderId, fileBuffer, fileName, mimeType) => {
    try {
        // Format the private key correctly (replace literal \n with actual newlines if needed)
        const formattedKey = key.replace(/\\n/g, '\n');

        const auth = new google.auth.JWT(
            email,
            null,
            formattedKey,
            ['https://www.googleapis.com/auth/drive.file']
        );

        const drive = google.drive({ version: 'v3', auth });

        const bufferStream = new stream.PassThrough();
        bufferStream.end(fileBuffer);

        const fileMetadata = {
            name: fileName,
            parents: [folderId]
        };

        const media = {
            mimeType: mimeType,
            body: bufferStream
        };

        const file = await drive.files.create({
            resource: fileMetadata,
            media: media,
            fields: 'id, webViewLink, webContentLink'
        });
        
        // Share the file publicly so it can be viewed as an avatar/resource
        await drive.permissions.create({
            fileId: file.data.id,
            requestBody: {
                role: 'reader',
                type: 'anyone'
            }
        });

        return file.data.webViewLink; // or webContentLink for direct download
    } catch (error) {
        console.error('Google Drive Upload Error:', error);
        throw new Error('Google Drive upload failed: ' + error.message);
    }
};
