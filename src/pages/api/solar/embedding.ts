import { NextApiRequest, NextApiResponse } from 'next'
import { IChatResponse } from '@/interfaces/common/IChatMessage'
import {
    IEmbeddingData,
    IEmbeddingResponse,
} from '@/interfaces/draft/IEmbeddingResponse'

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
        const { queries } = req.body
        const apiKey = process.env.UPSTAGE_API_KEY

        if (!apiKey) {
            return res.status(500).json({ message: 'API Key is missing' })
        }

        // 헤더 체크
        const innovationHeader = req.headers['innovation']
        if (innovationHeader !== 'RN7MGKVRA8') {
            return res.status(401).json({ message: 'Unauthorized' })
        }

        const apiResponse = await fetch(
            'https://api.upstage.ai/v1/solar/embeddings',
            {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${apiKey}`, // .env에서 읽은 API Key 사용
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    model: 'embedding-query',
                    input: queries,
                }),
            }
        )

        if (!apiResponse.ok) {
            return res.status(apiResponse.status).json({
                message: 'Failed to fetch from Upstage API',
            })
        }

        // JSON 응답 처리
        const embeddings: IEmbeddingData[] = (await apiResponse.json()).data

        const response: IEmbeddingResponse = {
            success: true,
            data: embeddings, // message.content 값
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
