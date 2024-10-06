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

// IChatResponse 인터페이스 정의
export interface IChatResponse {
    success: boolean
    data: string
    error?: string
}
