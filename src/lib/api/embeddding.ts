import { IEmbeddingResponse } from '@/interfaces/draft/IEmbeddingResponse'

export const fetchEmbeddingScores = async (
    queries: string[]
): Promise<IEmbeddingResponse> => {
    try {
        const res = await fetch(`/api/solar/embedding`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                innovation: 'RN7MGKVRA8',
            },
            body: JSON.stringify({
                queries: queries,
            }),
        })

        if (!res.ok) {
            throw new Error('Failed to fetch translation response')
        }

        // JSON 응답 처리
        const data = await res.json()

        return {
            success: data['success'],
            data: data['data'], // 번역된 키워드를 반환
        }
    } catch (error) {
        console.error('Error fetching translation response:', error)
        return {
            success: false,
            data: [],
            error: error instanceof Error ? error.message : 'Unknown error',
        }
    }
}
