import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const R2 = new S3Client({
    region: 'auto',
    endpoint: process.env.R2_ENDPOINT || `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
    },
});

export const r2Service = {
    getUploadUrl: async (key: string, contentType: string = 'video/mp4') => {
        const command = new PutObjectCommand({
            Bucket: process.env.R2_BUCKET_NAME || '',
            Key: key,
            ContentType: contentType,
        });
        // Valid for 1 hour
        const url = await getSignedUrl(R2, command, { expiresIn: 3600 });
        return url;
    },

    getFileStream: async (key: string) => {
        const command = new GetObjectCommand({
            Bucket: process.env.R2_BUCKET_NAME || '',
            Key: key,
        });
        const response = await R2.send(command);
        return response.Body;
    }
};
