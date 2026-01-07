import { GoogleGenerativeAI } from "@google/generative-ai";
import { GoogleAIFileManager } from "@google/generative-ai/server";
import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config();

// Fix: Force set GOOGLE_PROJECT_ID to prevent GoogleAuth error in certain environments
if (!process.env.GOOGLE_PROJECT_ID) {
    process.env.GOOGLE_PROJECT_ID = 'dummy-project-id';
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const fileManager = new GoogleAIFileManager(process.env.GEMINI_API_KEY);

export const geminiService = {
    // generic analysis for visual content
    analyzeContent: async (filePath, mimeType = "image/jpeg") => {
        try {
            // 1. Upload to Gemini
            console.log('Uploading to Gemini:', mimeType);
            const uploadResponse = await fileManager.uploadFile(filePath, {
                mimeType: mimeType,
                displayName: 'UserMeal_' + Date.now(),
            });

            console.log(`Uploaded file as: ${uploadResponse.file.uri}`);

            // 2. Wait for processing (Usually instant for images, but good for safety)
            let file = await fileManager.getFile(uploadResponse.file.name);
            let attempts = 0;
            // Video needs processing, images usually don't, but we check anyway.
            while (file.state === "PROCESSING") {
                if (attempts > 30) throw new Error("Timeout waiting for file processing");
                process.stdout.write(".");
                await new Promise((resolve) => setTimeout(resolve, 1000));
                file = await fileManager.getFile(uploadResponse.file.name);
                attempts++;
            }

            if (file.state === "FAILED") {
                throw new Error("File processing failed on Gemini side.");
            }

            console.log('File ready. Generating dietary analysis...');

            // 3. Generate Content
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

            const responseText = result.response.text();

            // 4. Cleanup
            fileManager.deleteFile(uploadResponse.file.name).catch(console.error);

            return responseText;
        } catch (error) {
            console.error('Gemini Service Error:', error);
            throw error;
        }
    }
};
