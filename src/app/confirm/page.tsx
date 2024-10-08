'use client'

import { HorizontalNavbar } from '@/components/ui/navbar/HorizontalNavbar'
import { Suspense, useEffect, useState } from 'react'
import LoadingShimmer from '@/components/ui/loading/LoadingShimmer'
import { appRoutes } from '@/Constants'
import { useRouter, useSearchParams } from 'next/navigation'
import apiClient from '@/lib/apiClient'
import {
    IBlogSearchItem,
    INaverSearchItem,
    INewsSearchItem,
    IWebSearchItem,
} from '@/interfaces/search/INaverSearch'
import { useRecoilState } from 'recoil'
import { draftDataAtom } from '@/atoms/draftDataAtom'
import { IChatExample } from '@/interfaces/common/IChatExample'
import NaverSearchItemComponent from '@/components/page/confirm/NaverSearchItemComponent'
import NaverSearchItemList from '@/components/page/confirm/NaverSearchItemList'
import { removeHtmlTags } from '@/util/TextUtils'
import SizedBox from '@/components/ui/box/SizedBox'
import { Alert, Button, Input, message, Modal, Popconfirm } from 'antd'
import UrlContentItemList from '@/components/page/confirm/UrlContentItemList'
import { fetchDataFromUrls } from '@/util/WebUtil'
import urlContentItemComponent from '@/components/page/confirm/UrlContentItemComponent'
import OcrContentItemList from '@/components/page/confirm/OcrContentItemList'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import { AlertCircleIcon } from 'lucide-react'
import GradientText from '@/components/ui/text/GradientText'
import { Typography } from 'antd'

export default function Confirm() {
    return (
        <Suspense fallback={<LoadingShimmer message="로딩 중입니다..." />}>
            <ConfirmPage />
        </Suspense>
    )
}

const ConfirmPage = () => {
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [messageApi, contextHolder] = message.useMessage()
    const [loadingMessage, setLoadingMessage] = useState('잠시만 기다려주세요!')
    const [draftData, setDraftData] = useRecoilState(draftDataAtom)
    const [isAllSelected, setIsAllSearchItemsSelected] = useState(false)
    const [isEditingQuestion, setIsEditingQuestion] = useState(false)
    const [isEditingKeyword, setIsEditingKeyword] = useState(false)
    const [visibleConfirmModal, setVisibleConfirmModal] = useState(false)
    const [selectedSearchItems, setSelectedSearchItems] = useState<Set<number>>(
        new Set()
    )
    const [selectedUrlItems, setSelectedUrlItems] = useState<Set<number>>(
        new Set()
    )
    const [selectedAttachedDocItems, setSelectedAttachedDocItems] = useState<
        Set<number>
    >(new Set())

    const [naverSearchItems, setNaverSearchItems] = useState<
        INaverSearchItem[]
    >([])

    // 키워드를 필터링한다. 중복제거 및 빈도순으로
    const filterKeywords = (
        inputString: string,
        maxCount: number = 5
    ): string => {
        const wordsArray: string[] = inputString.split(' ')
        const filteredWordsArray = wordsArray.filter((word) =>
            /^[a-zA-Z0-9가-힣]+$/.test(word)
        )
        const wordFrequency: { [key: string]: number } = {}
        filteredWordsArray.forEach((word) => {
            if (/^[a-zA-Z0-9가-힣]+$/.test(word)) {
                wordFrequency[word] = (wordFrequency[word] || 0) + 1
            }
        })
        const sortedUniqueWords = Array.from(new Set(filteredWordsArray)).sort(
            (a, b) => wordFrequency[b] - wordFrequency[a]
        )
        return sortedUniqueWords.slice(0, maxCount).join(' ')
    }

    const getSearchKeywords = async (question: string) => {
        const searchKeywords = await apiClient.fetchSearchKeywords(question)
        const filteredSearchKeywords = filterKeywords(searchKeywords.data)
        return filteredSearchKeywords
    }

    const searchDataByNaver = async (
        searchKeyword: string
    ): Promise<INaverSearchItem[]> => {
        try {
            const searchQueryCount = draftData.searchQueryCount
            const [newsSearchResult, blogSearchResult, webSearchResult] =
                await Promise.all([
                    apiClient.fetchNaverSearchResponse(
                        searchKeyword,
                        'news',
                        searchQueryCount
                    ),
                    apiClient.fetchNaverSearchResponse(
                        searchKeyword,
                        'blog',
                        searchQueryCount
                    ),
                    apiClient.fetchNaverSearchResponse(
                        searchKeyword,
                        'webkr',
                        searchQueryCount
                    ),
                ])

            // Process news items
            const newsItems = newsSearchResult.items.map((item) => ({
                type: 'news',
                title: removeHtmlTags(item.title),
                link: item.link,
                description: removeHtmlTags(item.description),
            }))

            const blogItems = blogSearchResult.items.map((item) => ({
                type: 'blog',
                title: removeHtmlTags(item.title),
                link: item.link,
                description: removeHtmlTags(item.description),
            }))

            const webItems = webSearchResult.items.map((item) => ({
                type: 'webkr',
                title: removeHtmlTags(item.title),
                link: item.link,
                description: removeHtmlTags(item.description),
            }))

            return [...newsItems, ...blogItems, ...webItems]
        } catch (error) {
            console.error('Error occurred during Naver search:', error)
            return [] // Return an empty array in case of error
        }
    }

    // URL 기반 데이터 가져오기
    const startGetUrlContents = async () => {
        const urlContents = await fetchDataFromUrls(draftData.urls)
        if (urlContents.length === 0) return

        setDraftData((prevDraftData) => ({
            ...prevDraftData,
            urlContents: urlContents,
        }))
    }

    // 첨부된 file이 있는 경우, OCR수행
    const startOCR = async () => {
        if (draftData.docFiles.length === 0) return

        // Use Promise.all to wait for all OCR results to resolve
        const ocrResults: string[] = await Promise.all(
            draftData.docFiles.map(async (docFile) => {
                const result = await apiClient.fetchOCRResult(docFile)
                const htmlRemovedOcrResult = removeHtmlTags(result.data)
                return htmlRemovedOcrResult // Extract the OCR result (string)
            })
        )

        if (ocrResults.length === 0) return

        // Update draftData with the OCR results

        setDraftData((prevDraftData) => ({
            ...prevDraftData,
            docContents: ocrResults,
        }))
    }

    const initialize = async () => {
        const question = draftData.question ?? ''
        console.log(`question: ${question}`)

        try {
            // URL검색 병렬로 수행
            startGetUrlContents()

            // OCR도 병렬 수행
            startOCR()

            setLoading(true)

            // 검색 키워드 추출
            setLoadingMessage('검색 키워드를 추출하고 있습니다..')
            const searchKeyword = await getSearchKeywords(question)
            console.log(searchKeyword)

            // 네이버 검색
            setLoadingMessage('인터넷 검색중이에요..')
            const naverSearchItems = await searchDataByNaver(searchKeyword)
            setNaverSearchItems(naverSearchItems)

            setDraftData((prevDraftData) => ({
                ...prevDraftData,
                naverSearchItems: naverSearchItems,
            }))
        } finally {
            setLoading(false)
        }
    }

    const handleToggleSearchSelectAll = () => {
        if (isAllSelected) {
            setSelectedSearchItems(new Set()) // 전체 해제
        } else {
            const allItems = new Set(naverSearchItems.map((_, index) => index))
            setSelectedSearchItems(allItems) // 전체 선택
        }
        setIsAllSearchItemsSelected(!isAllSelected) // 상태 반전
    }

    const handleSearchSelectionChange = (index: number) => {
        const updatedSelectedItems = new Set(selectedUrlItems)
        if (updatedSelectedItems.has(index)) {
            updatedSelectedItems.delete(index)
        } else {
            updatedSelectedItems.add(index)
        }
        setSelectedUrlItems(updatedSelectedItems)
    }

    const handleAttahcedDocSelectionChange = (index: number) => {
        const updatedSelectedItems = new Set(selectedAttachedDocItems)
        if (updatedSelectedItems.has(index)) {
            updatedSelectedItems.delete(index)
        } else {
            updatedSelectedItems.add(index)
        }
        setSelectedAttachedDocItems(updatedSelectedItems)
    }

    const handleEditQuestion = () => {
        setIsEditingQuestion(!isEditingQuestion)
    }

    const handleEditKeyword = () => {
        setIsEditingKeyword(!isEditingKeyword)
    }

    const startMakeReport = () => {
        const question = draftData.question // string
        const keywords = draftData.keywords // string
        const docContents = draftData.docContents // string[]. 전체 OCR결과
        const urlContents = draftData.urlContents // string[]. 전체 URL결과

        //선택된 항목들에 대한 OCR 결과
        const filteredDocContents: string[] = docContents?.filter((_, index) =>
            selectedAttachedDocItems.has(index)
        )
        //선택된 웹검색 결과
        const filteredUrlContents: string[] = urlContents?.filter((_, index) =>
            selectedUrlItems.has(index)
        )

        // 선택된 네이버 결과
        const filteredNaverContents: INaverSearchItem[] =
            naverSearchItems?.filter((_, index) =>
                selectedSearchItems.has(index)
            )

        // 필터링된 데이터를 atom상에 넣는다.
        setDraftData((prevDraftData) => ({
            ...prevDraftData,
            question: question,
            keywords: keywords,
            docContents: filteredDocContents,
            urlContents: filteredUrlContents,
            naverSearchItems: filteredNaverContents,
        }))

        router.push(appRoutes.generate)
    }

    const onMakeReportButtonClicked = () => {
        setVisibleConfirmModal(true)
    }

    useEffect(() => {
        initialize()
    }, [])

    return loading ? (
        <LoadingShimmer message={loadingMessage} />
    ) : (
        <>
            {contextHolder}
            <div className={'w-screen h-screen flex justify-center'}>
                <HorizontalNavbar />
                <div
                    className={
                        'h-screen overflow-y-auto flex flex-col flex-1 px-[120px] py-[60px] gap-[32px]'
                    }
                >
                    {/* (1) 보고서 주제: 질문, 키워드 */}
                    <div className={'flex flex-col'}>
                        <GradientText fontSize={'36px'} bold={true}>
                            리포트 생성을 위해 활용할 데이터들을 준비할게요.
                        </GradientText>
                        <span className={'text-[14px] text-gray-600'}>
                            보고서 작성시 포함할 항목을 선택해주세요.
                        </span>
                    </div>

                    <div className={'flex flex-col'}>
                        <Typography.Title level={3}>📝 보고서 주제</Typography.Title>
                        <span className={'text-[14px] text-gray-400'}>
                            아래 질문과 키워드를 기반으로 보고서를 작성합니다. 맞는지 확인해주세요.
                        </span>
                    </div>

                    {/* 질문 */}
                    <div className={'flex flex-col'}>
                        <div className={'flex items-center'}>
                            <span className={'text-[18px] font-bold'}>
                                질문
                            </span>
                            <SizedBox width={12} />
                            <span
                                onClick={handleEditQuestion}
                                className={
                                    'text-[14px] text-blue-500 cursor-pointer font-bold'
                                }
                            >
                                {isEditingQuestion ? '수정완료' : '수정하기'}
                            </span>
                        </div>

                        <SizedBox height={4} />

                        {!isEditingQuestion && (
                            <span className={'text-[14px] text-gray-500'}>
                                {draftData.question}
                            </span>
                        )}

                        {isEditingQuestion && (
                            <Input
                                value={draftData.question}
                                placeholder={'질문을 입력해주세요.'}
                                className={'w-[512px] text-[14px]'}
                                onChange={(e) => {
                                    setDraftData((prevDraftData) => ({
                                        ...prevDraftData,
                                        question: e.target.value,
                                    }))
                                }}
                            />
                        )}
                    </div>

                    {/* 키워드 */}
                    <div className={'flex flex-col'}>
                        <div className={'flex items-center'}>
                            <span className={'text-[18px] font-bold'}>
                                키워드
                            </span>
                            <SizedBox width={12} />
                            <span
                                onClick={handleEditKeyword}
                                className={
                                    'text-[14px] text-blue-500 cursor-pointer font-bold'
                                }
                            >
                                {isEditingKeyword ? '수정완료' : '수정하기'}
                            </span>
                        </div>

                        <SizedBox height={4} />

                        {!isEditingKeyword && (
                            <span className={'text-[14px] text-gray-500'}>
                                {draftData.keywords &&
                                draftData.keywords?.length > 0
                                    ? draftData.keywords
                                    : '설정된 키워드가 없습니다.'}
                            </span>
                        )}

                        {isEditingKeyword && (
                            <Input
                                value={draftData.keywords}
                                placeholder={'키워드를 입력해주세요.'}
                                className={'w-[512px] text-[14px]'}
                                onChange={(e) => {
                                    setDraftData((prevDraftData) => ({
                                        ...prevDraftData,
                                        keywords: e.target.value,
                                    }))
                                }}
                            />
                        )}
                    </div>

                    {/* (2) 외부지식 (웹검색): 네이버 검색 결과, URL 지정 */}
                    <div className={'flex flex-col'}>
                        <Typography.Title level={3}>🌐 외부지식 (웹검색)</Typography.Title>
                        <span className={'text-[14px] text-gray-400'}>
                            아래의 검색 결과 중 보고서 작성시 사용할
                            링크를 선택해주세요.
                        </span>
                    </div>
                    {draftData.urls.length > 0 && (
                        <div className={'flex flex-col'}>
                            <div className={'flex items-end'}>
                                <div className={'flex flex-col'}>
                                    <span className={'text-[18px] font-bold'}>
                                        참고 URL (입력한 URL)
                                    </span>
                                </div>
                            </div>

                            <SizedBox height={16} />

                            <UrlContentItemList
                                contents={draftData.urlContents}
                                urls={draftData.urls}
                                selectedItems={selectedUrlItems}
                                onSelectionChange={handleSearchSelectionChange}
                            />
                        </div>
                    )}

                    {naverSearchItems.length > 0 && (
                        <div className={'flex flex-col'}>
                            <div className={'flex items-end'}>
                                <div className={'flex flex-col'}>
                                    <span className={'text-[18px] font-bold'}>
                                        웹검색 결과
                                    </span>
                                </div>

                                <div className={'flex-1'} />
                                <span
                                    onClick={handleToggleSearchSelectAll}
                                    className="text-blue-500 cursor-pointer"
                                >
                                    {isAllSelected ? '전체 해제' : '전체 선택'}
                                </span>
                            </div>

                            <SizedBox height={16} />

                            <NaverSearchItemList
                                items={naverSearchItems}
                                isAllSelected={isAllSelected}
                                onToggleSelectAll={handleToggleSearchSelectAll}
                                selectedItems={selectedSearchItems}
                                onSelectionChange={(index) => {
                                    const updatedSelectedItems = new Set(
                                        selectedSearchItems
                                    ) // create a new Set to avoid mutation
                                    if (updatedSelectedItems.has(index)) {
                                        updatedSelectedItems.delete(index)
                                    } else {
                                        updatedSelectedItems.add(index)
                                    }
                                    setSelectedSearchItems(updatedSelectedItems) // set the new Set
                                }}
                            />
                        </div>
                    )}

                    {/* (3) 내부지식 (문서): 첨부파일 제공 */}
                    <div className={'flex flex-col'}>
                        <Typography.Title level={3}>📂 내부지식 (문서)</Typography.Title>
                        <span className={'text-[14px] text-gray-400'}>
                            입력한 파일 중 보고서 작성시 사용할 파일을 선택해주세요.
                        </span>
                    </div>
                    {draftData.docFiles.length > 0 && (
                        <div className={'flex flex-col'}>
                            <div className={'flex items-end'}>
                                <div className={'flex flex-col'}>
                                    <span className={'text-[18px] font-bold'}>
                                        참고 파일 (입력한 파일)
                                    </span>
                                </div>
                            </div>

                            <SizedBox height={16} />

                            <OcrContentItemList
                                files={draftData.docFiles}
                                ocrContents={draftData.docContents}
                                selectedItems={selectedAttachedDocItems}
                                onSelectionChange={
                                    handleAttahcedDocSelectionChange
                                }
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* 생성 확인 모달 */}
            <Modal
                title={
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <AlertCircleIcon
                            style={{
                                color: '#6D28D9',
                                marginRight: '8px',
                                width: '20px',
                                height: '20px',
                            }}
                        />
                        <span className={'h-[20px]'}>
                            보고서 생성을 시작하시겠습니까?
                        </span>
                    </div>
                }
                centered
                open={visibleConfirmModal}
                onOk={() => {
                    setVisibleConfirmModal(false)
                    startMakeReport()
                }}
                onCancel={() => setVisibleConfirmModal(false)}
                footer={[
                    <Button
                        key="back"
                        onClick={() => setVisibleConfirmModal(false)}
                    >
                        취소
                    </Button>,
                    <Button
                        key="submit"
                        type="primary"
                        onClick={() => {
                            setVisibleConfirmModal(false)
                            startMakeReport()
                        }}
                    >
                        시작
                    </Button>,
                ]}
            >
                <span>보고서 생성은 약 15초 정도 소요됩니다.</span>
            </Modal>

            {/* 생성 시작 버튼 */}
            <button
                className="
          fixed bottom-10 left-1/2 transform -translate-x-1/2
          bg-gradient-to-r from-purple-800 via-purple-500 to-pink-500 text-white py-3 px-6 rounded-full
          shadow-xl hover:bg-blue-700 transition duration-300 font-bold border-none ring-0 
          m-4
        "
                onClick={onMakeReportButtonClicked}
            >
                보고서 만들기
            </button>
        </>
    )
}
