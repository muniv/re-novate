// Interface for web search response items
export interface INaverSearchItem {
    index?: number
    type: string
    title: string
    link: string
    description: string
    embeddingScore?: number[]
    isGrounded?: boolean
}

export type IWebSearchItem = INaverSearchItem

// Interface for news search response items
export interface INewsSearchItem extends INaverSearchItem {
    originallink: string
    pubDate: string
}

// Interface for blog search response items
export interface IBlogSearchItem extends INaverSearchItem {
    bloggername: string
    bloggerlink: string
    postdate: string
}

// Unified interface for common search response structure
export interface ISearchResponse<T> {
    lastBuildDate: string
    total: number
    start: number
    display: number
    items: T[]
}
