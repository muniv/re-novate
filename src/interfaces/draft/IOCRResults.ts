export interface IOCRContent {
    html: string
    markdown: string
    text: string
}

export interface ICoordinates {
    x: number
    y: number
}

export interface IOCRItem {
    category: string // e.g., "heading1", "paragraph"
    content: IOCRContent
    coordinates: ICoordinates[]
    id: number
    page: number
}

export interface IOCRData {
    api: string
    content: IOCRContent // The main content (if needed)
    elements: IOCRItem[] // Array of parsed OCR elements
    model: string
    usage: {
        pages: number
    }
}

export interface IOCRResponse {
    success: boolean
    data: IOCRData
}
