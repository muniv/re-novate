import { NextApiRequest, NextApiResponse } from 'next'
import { IChatResponse } from '@/interfaces/common/IChatMessage'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== 'POST') {
        return res
            .status(405)
            .json({ message: 'Only POST requests are allowed' })
    }

    try {
        const { model, messages } = req.body
        const apiKey = process.env.GROQ_API_KEY

        if (!apiKey) {
            return res.status(500).json({ message: 'API Key is missing' })
        }

        // 헤더 체크
        const innovationHeader = req.headers['innovation']
        if (innovationHeader !== 'RN7MGKVRA8') {
            return res.status(401).json({ message: 'Unauthorized' })
        }

        const apiResponse = await fetch(
            'https://api.groq.com/openai/v1/chat/completions',
            {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${apiKey}`, // .env에서 읽은 API Key 사용
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    model: model || 'llama3-70b-8192', // default model
                    messages: messages || [
                        {
                            role: 'system',
                            content: 'You are a helpful assistant.',
                        },
                        {
                            role: 'user',
                            content: messages,
                        },
                    ],
                    stream: false, // 스트리밍 비활성화
                }),
            }
        )

        if (!apiResponse.ok) {
            return res.status(apiResponse.status).json({
                message: 'Failed to fetch from OpenAI API',
            })
        }

        // JSON 응답 처리
        const data = await apiResponse.json()

        // 실제 응답에서 choices 배열에서 content를 추출
        const content = data.choices?.[0]?.message?.content || 'No response'

        const response: IChatResponse = {
            success: true,
            data: content, // message.content 값
        }

        // JSON 응답을 클라이언트에 전달
        res.status(200).json(response)
    } catch (error) {
        console.error('Error in response: ', error)
        const response: IChatResponse = {
            success: false,
            data: '',
            error: error instanceof Error ? error.message : 'Unknown error',
        }
        res.status(500).json(response)
    }
}
