import {
    ISearchResponse,
    IWebSearchItem,
    INewsSearchItem,
    IBlogSearchItem,
} from '@/interfaces/search/INaverSearch'

export const fetchNaverSearchResponse = async (
    query: string,
    category: 'webkr' | 'news' | 'blog',
    queryCount: number = 3
): Promise<
    ISearchResponse<IWebSearchItem | INewsSearchItem | IBlogSearchItem>
> => {
    try {
        const res = await fetch(
            `/api/naverSearch?query=${encodeURIComponent(query)}&category=${encodeURIComponent(category)}&display=${queryCount}`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    innovation: 'RN7MGKVRA8',
                },
            }
        )

        if (!res.ok) {
            throw new Error('Failed to fetch Naver search response')
        }

        const data = await res.json()

        // console.log(`### Data: ${JSON.stringify(data)}`)

        // Return the response data based on category type
        if (category === 'webkr') {
            return data as ISearchResponse<IWebSearchItem>
        } else if (category === 'news') {
            return data as ISearchResponse<INewsSearchItem>
        } else if (category === 'blog') {
            return data as ISearchResponse<IBlogSearchItem>
        } else {
            throw new Error('Unknown category')
        }
    } catch (error) {
        console.error('Error fetching Naver search response:', error)
        throw error // Re-throw the error for handling at a higher level
    }
}
