// pages/api/naverSearch.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'

const NAVER_CLIENT_ID = process.env.NAVER_CLIENT_ID
const NAVER_CLIENT_SECRET = process.env.NAVER_CLIENT_SECRET

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const { query, category, display } = req.query

    if (
        !query ||
        typeof query !== 'string' ||
        !category ||
        typeof category !== 'string'
    ) {
        return res.status(400).json({ error: 'Invalid query or category' })
    }

    try {
        // 카테고리에 따라 API URL을 동적으로 생성
        const apiUrl = `https://openapi.naver.com/v1/search/${category}?query=${encodeURIComponent(query as string)}&display=${display}`

        const response = await axios.get(apiUrl, {
            headers: {
                'X-Naver-Client-Id': NAVER_CLIENT_ID,
                'X-Naver-Client-Secret': NAVER_CLIENT_SECRET,
            },
        })

        console.log(response.data)

        res.status(200).json(response.data)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Failed to fetch data from Naver API' })
    }
}

export default handler
