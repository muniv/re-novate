// 초안 키워드, 첨부파일들을 상태관리하기 위한 인터페이스
import { INaverSearchItem } from '@/interfaces/search/INaverSearch'
import { LLMType } from '@/Constants'

export interface IDraftData {
    question?: string // 질문
    keywords?: string // 키워드
    searchQueryCount?: number // 인터넷 검색 수
    urls: string[] // 검색할 url들
    urlContents: string[] // 검색된 url 결과들
    docFiles: File[] // 첨부한 파일들
    docContents: string[] // 첨부한 파일 내용들
    naverSearchItems: INaverSearchItem[] // 네이버 검색결과
    useDalle?: boolean
}
