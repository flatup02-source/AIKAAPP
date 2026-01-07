import { messagingApi } from "@line/bot-sdk";
import dotenv from 'dotenv';
dotenv.config();

const { MessagingApiClient } = messagingApi;

const client = new MessagingApiClient({
    channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
});

export const lineService = {
    pushMessage: async (userId, text) => {
        try {
            await client.pushMessage({
                to: userId,
                messages: [{ type: 'text', text: text }],
            });
            console.log(`Pushed message to ${userId}`);
        } catch (error) {
            console.error('Line Push Error:', error);
            // Don't throw, just log. We don't want to crash everything if line fails.
        }
    }
};
