import { GoogleGenerativeAI } from "@google/generative-ai";
import { GoogleAIFileManager } from "@google/generative-ai/server";

const apiKey = process.env.GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(apiKey);
const fileManager = new GoogleAIFileManager(apiKey);

export const geminiService = {
    // Determine mime type from extension
    getMimeType: (filename: string) => {
        if (filename.endsWith('.mp4')) return 'video/mp4';
        if (filename.endsWith('.mov')) return 'video/quicktime';
        if (filename.endsWith('.avi')) return 'video/x-msvideo';
        if (filename.endsWith('.png')) return 'image/png';
        if (filename.endsWith('.jpg') || filename.endsWith('.jpeg')) return 'image/jpeg';
        if (filename.endsWith('.webp')) return 'image/webp';
        if (filename.endsWith('.heic')) return 'image/heic';
        return 'video/mp4'; // Default
    },

    analyzeContent: async (filePath: string, mimeType: string = "image/jpeg") => {
        try {
            console.log('Uploading to Gemini:', mimeType);
            const uploadResponse = await fileManager.uploadFile(filePath, {
                mimeType: mimeType,
                displayName: 'UserMeal_' + Date.now(),
            });

            console.log(`Uploaded file as: ${uploadResponse.file.uri}`);

            let file = await fileManager.getFile(uploadResponse.file.name);
            while (file.state === "PROCESSING") {
                // In serverless, writing to stdout is fine but no newline is better for logs
                console.log("Processing...");
                await new Promise((resolve) => setTimeout(resolve, 2000));
                file = await fileManager.getFile(uploadResponse.file.name);
            }

            if (file.state === "FAILED") {
                throw new Error("Video processing failed.");
            }

            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
            const prompt = `
あなたは世界一優しいプロの管理栄養士（FLAT UP GYM DIET AI）です。
この食事画像のカロリーを推算し、以下のフォーマットでアドバイスをしてください。

【推算カロリー】
約〇〇kcal

【栄養バランス評価】
（良い点と、不足している栄養素など）

【プロのアドバイス】
（具体的な改善点や、次に食べると良いものなど）

【応援メッセージ】
（「痛くない・怖くない・楽しい」ジムの雰囲気で、優しく励ましてください）
            `;

            const result = await model.generateContent([
                {
                    fileData: {
                        mimeType: file.mimeType,
                        fileUri: file.uri
                    }
                },
                { text: prompt }
            ]);
            // fileManager.deleteFile(file.name); // Optional cleanup
            return result.response.text();
        } catch (error) {
            console.error('Gemini Service Error:', error);
            throw error;
        }
    }
};
