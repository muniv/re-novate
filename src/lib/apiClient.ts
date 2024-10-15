import {
    fetchChatResponse,
    fetchKeyword,
    fetchRearrangedQuestion,
    fetchReportMarkdown,
    fetchSearchKeywords,
    fetchRearrangedContexts,
    fetchDallEResponse,
    fetchKeywordForDalle,
    fetchTranslateKeywordsToEnglish,
    fetchTranslate, // 이름 변경
    fetchStructuredResponse,
    fetchGroundness,
} from './api/chat'
import { fetchNaverSearchResponse } from '@/lib/api/naverSearch'
import { fetchOCRResult } from '@/lib/api/ocr'
import { fetchEmbeddingScores } from '@/lib/api/embeddding'

const apiClient = {
    fetchChatResponse,
    fetchNaverSearchResponse,
    fetchSearchKeywords,
    fetchReportMarkdown,
    fetchRearrangedQuestion,
    fetchRearrangedContexts,
    fetchKeywordForDalle,
    fetchKeyword,
    fetchOCRResult,
    fetchDallEResponse,
    fetchTranslateKeywordsToEnglish,
    fetchEmbeddingScores,
    fetchTranslate,
    fetchStructuredResponse,
    fetchGroundness,
}

export default apiClient
