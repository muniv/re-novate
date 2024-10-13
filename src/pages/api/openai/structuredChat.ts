import { NextApiRequest, NextApiResponse } from 'next';
import { IChatResponse } from '@/interfaces/common/IChatMessage';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Only POST requests are allowed' });
    }

    try {
        const { model, messages } = req.body;
        const apiKey = process.env.OPENAI_API_KEY;

        if (!apiKey) {
            return res.status(500).json({ message: 'API Key is missing' });
        }

        // 헤더 체크
        const innovationHeader = req.headers['innovation'];
        if (innovationHeader !== 'RN7MGKVRA8') {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        // JSON Schema 정의
        const jsonSchema = {
            type: "object",
            properties: {
                title: { type: "string" },
                introduction: { type: "string" },
                body1: { type: "string" },
                body2: { type: "string" },
                body3: { type: "string" },
                body4: { type: "string" },
                body5: { type: "string" },
                conclusion: { type: "string" }
            },
            required: ["title", "introduction", "body1", "body2", "body3", "body4", "body5", "conclusion"]
        };

        // OpenAI API 호출
        const apiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${apiKey}`, // .env에서 읽은 API Key 사용
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: model || 'gpt-4o-mini', // default model
                messages: messages || [
                    { role: 'system', content: 'You are a helpful assistant.' },
                    { role: 'user', content: messages },
                ],
                response_format: {
                    type: "json_schema",
                    json_schema: jsonSchema,
                    strict: true // 스키마 엄격 적용
                },
                stream: false // 스트리밍 비활성화
            }),
        });

        if (!apiResponse.ok) {
            return res.status(apiResponse.status).json({
                message: 'Failed to fetch from OpenAI API',
            });
        }

        // JSON 응답 처리
        const data = await apiResponse.json();

        // 구조화된 응답에서 필요한 데이터 추출
        const content = data.choices?.[0]?.message?.content || 'No structured response';

        const response: IChatResponse = {
            success: true,
            data: content, // message.content 값
        };

        // JSON 응답을 클라이언트에 전달
        res.status(200).json(response);
    } catch (error) {
        console.error('Error in response: ', error);
        const response: IChatResponse = {
            success: false,
            data: '',
            error: error instanceof Error ? error.message : 'Unknown error',
        };
        res.status(500).json(response);
    }
}