import { IApiResponse } from '../common/IChatMessage'

export interface IEmbeddingData {
    object: string
    index: number
    embedding: number[]
}

export interface IEmbeddingResponse extends IApiResponse {
    data: IEmbeddingData[]
}
