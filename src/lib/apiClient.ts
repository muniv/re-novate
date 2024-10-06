import {
    fetchChatResponse,
    fetchKeyword,
    fetchRearrangedQuestion,
    fetchReportMarkdown,
    fetchSearchKeywords,
    fetchRearrangedContexts,
    fetchDallEResponse,
    fetchKeywordForDalle,
    fetchTranslateKeywordsToEnglish, // 이름 변경
} from './api/chat'
import { fetchNaverSearchResponse } from '@/lib/api/naverSearch'
import { fetchOCRResult } from '@/lib/api/ocr'

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
}

export default apiClient
