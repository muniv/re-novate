import axios from 'axios'
import { removeHtmlTags } from '@/util/TextUtils'
import cheerio from 'cheerio'

function extractBodyContent(html: string): string {
    const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i) // <body> 태그 내용 추출
    return bodyMatch ? bodyMatch[1] : '' // 매칭된 그룹 반환, 없으면 빈 문자열
}

export async function fetchDataFromUrls(urls: string[]): Promise<string[]> {
    const results = await Promise.all(
        urls.map(async (url) => {
            try {
                const proxyUrl = `/api/proxy?url=${encodeURIComponent(url)}`
                const { data } = await axios.get(proxyUrl)

                // 문자열 검색으로 <body> 태그 안의 내용만 추출
                const bodyContent = extractBodyContent(data)

                return bodyContent
            } catch (error) {
                console.error(`Failed to fetch metadata from ${url}:`, error)
                return '오류가 발생하였습니다.'
            }
        })
    )

    const cleanedResults = results.map((result) => removeHtmlTags(result))
    return cleanedResults
}

export const openLinkInNewTab = (url: string) => {
    if (!url) {
        console.error('URL이 제공되지 않았습니다.')
        return
    }
    window.open(url, '_blank', 'noopener,noreferrer')
}
