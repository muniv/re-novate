import { createProxyMiddleware } from 'http-proxy-middleware'
import { NextApiRequest, NextApiResponse } from 'next'

export const config = {
    api: {
        bodyParser: false, // Proxy에서 처리할 수 있도록 bodyParser 사용 안 함
    },
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    const { url } = req.query

    if (typeof url !== 'string') {
        return res.status(400).json({ error: 'Invalid URL' })
    }

    const targetUrl = new URL(decodeURIComponent(url))
    const proxy = createProxyMiddleware({
        target: targetUrl.origin, // URL에서 추출한 origin (https://example.com)
        changeOrigin: true, // CORS 우회
        pathRewrite: {
            [`^/api/proxy`]: targetUrl.pathname + targetUrl.search, // 나머지 경로와 쿼리 문자열 유지
        },
    })

    return proxy(req, res, (result: any) => {
        if (result instanceof Error) {
            res.status(500).send({ error: 'Proxy failed' })
        }
    })
}
