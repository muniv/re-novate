export interface IChatMessage {
    bubbleId: number
    role: 'system' | 'user' | 'assistant'
    content: string
    isLoading?: boolean
}

// IChatRequestBody 인터페이스 정의
export interface IChatRequestBody {
    model: string
    messages: IChatMessage[]
}

export interface IApiResponse {
    success: boolean
    data: unknown
    error?: string
}

// IChatResponse 인터페이스 정의
export interface IChatResponse extends IApiResponse {
    data: string
}
