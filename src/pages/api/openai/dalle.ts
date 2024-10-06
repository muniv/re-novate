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
        const { prompt, n, size } = req.body
        const apiKey = process.env.OPENAI_API_KEY

        if (!apiKey) {
            return res.status(500).json({ message: 'API Key is missing' })
        }

        // 헤더 체크
        const innovationHeader = req.headers['innovation']
        if (innovationHeader !== 'RN7MGKVRA8') {
            return res.status(401).json({ message: 'Unauthorized' })
        }

        // DALL·E API 호출
        const apiResponse = await fetch(
            'https://api.openai.com/v1/images/generations',
            {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${apiKey}`, // .env에서 읽은 API Key 사용
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    prompt: prompt || 'An image of a beautiful landscape',
                    n: n || 1, // 이미지 생성 개수 (기본값 1)
                    size: size || '512x512', // 이미지 크기 (기본값 512x512)
                }),
            }
        )

        if (!apiResponse.ok) {
            return res.status(apiResponse.status).json({
                message: 'Failed to fetch from OpenAI DALL·E API',
            })
        }

        // JSON 응답 처리
        const data = await apiResponse.json()

        const response: IChatResponse = {
            success: true,
            data: data.data?.[0]?.url || 'No image generated', // 첫 번째 이미지의 URL을 반환
        }

        // DALL·E 응답을 클라이언트에 전달
        res.status(200).json(response)
    } catch (error) {
        console.error('Error in DALL·E response: ', error)
        const response: IChatResponse = {
            success: false,
            data: '',
            error: error instanceof Error ? error.message : 'Unknown error',
        }
        res.status(500).json(response)
    }
}

// 상태&호출

// DALL·E 관련 상태 추가
// const [dallePrompt, setDallePrompt] = useState('')
// const [imageUrl, setImageUrl] = useState('')
// const [isLoadingImage, setIsLoadingImage] = useState(false)


// DALL·E API 호출 함수
// const generateDalleImage = async () => {
//     if (!dallePrompt) return
//     setIsLoadingImage(true)

//     try {
//         const response = await fetch('/api/openai/dalle', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({
//                 prompt: dallePrompt,
//                 n: 1,
//                 size: '1024x1024',
//             }),
//         })
//         const data = await response.json()

//         if (data.success) {
//             setImageUrl(data.data)
//         } else {
//             console.error('Failed to generate image:', data.error)
//         }
//     } catch (error) {
//         console.error('Error generating image:', error)
//     } finally {
//         setIsLoadingImage(false)
//     }
// }