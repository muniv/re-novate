'use client'

import LoadingShimmer from '@/components/ui/loading/LoadingShimmer'
import { Suspense, useEffect, useState } from 'react'
import { IChatMessage } from '@/interfaces/common/IChatMessage'
import ChatWithMarkdownUI from '@/components/page/generate/ChatWithMarkdownUI'
import apiClient from '@/lib/apiClient'
import { appRoutes, LLMTasks, LLMType } from '@/Constants'
import { useRouter, useSearchParams } from 'next/navigation'
import {
    IBlogSearchItem,
    INewsSearchItem,
    INaverSearchItem,
    IWebSearchItem,
} from '@/interfaces/search/INaverSearch'
import { HorizontalNavbar } from '@/components/ui/navbar/HorizontalNavbar'
import { getPrompt } from '@/util/PromptUtils'
import { EditMarkdownModal } from '@/components/ui/modals/EditMarkdownModal'
import { useRecoilState } from 'recoil'
import { draftDataAtom } from '@/atoms/draftDataAtom'
import { settingsAtom } from '@/atoms/settingsAtom'
import { fetchReportMarkdown } from '@/lib/api/chat'

export default function Generate() {
    return (
        <Suspense fallback={<LoadingShimmer message="로딩 중입니다..." />}>
            <GenerateContent />
        </Suspense>
    )
}

function GenerateContent() {
    const searchParams = useSearchParams() // 쿼리 파���미터 읽기
    const [loading, setLoading] = useState(true)
    const [draftData, setDraftData] = useRecoilState(draftDataAtom)
    const [settings, setSettings] = useRecoilState(settingsAtom)
    const [visiblePdfEditModal, setVisiblePdfEditModal] = useState(false)
    const router = useRouter()

    const [selectedSentences, setSelectedSentences] = useState<Set<string>>(
        new Set()
    )

    const [markdown, setMarkdown] = useState('')
    const [prevMarkdown, setPrevMarkdown] = useState<string | undefined>(
        undefined
    )
    const [loadingMessage, setLoadingMessage] = useState('잠시만 기다려주세요!')
    const [messages, setMessages] = useState<IChatMessage[]>([
        {
            bubbleId: 0,
            role: 'assistant',
            content:
                '변경하고자 하는 부분을 클릭하신 후, 채팅으로 수정 요청을 해보세요!',
        },
    ])
    const [question, setQuestion] = useState('')
    const [markdownContent, setMarkdownContent] = useState(
        '# Welcome to the Markdown Viewer\n\nThis is a sample **Markdown** content.'
    )

    // 검색 키워드 구하기
    const getSearchKeywords = async (question: string) => {
        const searchKeywords = await apiClient.fetchSearchKeywords(question)
        const filteredSearchKeywords = filterKeywords(searchKeywords.data)
        return filteredSearchKeywords
    }

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

    const removeHtmlTags = (inputString: string): string => {
        return inputString.replace(/<\/?[^>]+(>|$)/g, '')
    }

    // 키워드로 뉴스, 블로그, 웹을 병렬적으로 검색해서, 컨텍스트를 가져온다.
    const searchDataByNaver = async (searchKeyword: string) => {
        try {
            const [newsSearchResult, blogSearchResult, webSearchResult] =
                await Promise.all([
                    apiClient.fetchNaverSearchResponse(
                        searchKeyword,
                        'news',
                        1
                    ),
                    apiClient.fetchNaverSearchResponse(
                        searchKeyword,
                        'blog',
                        1
                    ),
                    apiClient.fetchNaverSearchResponse(
                        searchKeyword,
                        'webkr',
                        1
                    ),
                ])

            let newsContext = ''
            const newsItems = newsSearchResult.items as INewsSearchItem[]
            newsItems.forEach((newsSearchItem, index) => {
                newsContext += `### 뉴스 아이템 ${index + 1}\n`
                newsContext += `- 제목 : ${newsSearchItem.title}`
                newsContext += `- 내용 : ${newsSearchItem.description}`
                newsContext += `- 링크 : ${decodeURI(newsSearchItem.link)}`
                newsContext += `\n\n`
            })

            let blogContext = ''
            const blogItems = blogSearchResult.items as IBlogSearchItem[]
            blogItems.forEach((blogSearchItem, index) => {
                blogContext += `### 블로그 아이템 ${index + 1}\n`
                blogContext += `- 제목 : ${blogSearchItem.title}`
                blogContext += `- 내용 : ${blogSearchItem.description}`
                blogContext += `- 링크 : ${decodeURI(blogSearchItem.link)}`
                blogContext += `\n\n`
            })

            let webSearchContext = ''
            const webItems = webSearchResult.items as IWebSearchItem[]
            webItems.forEach((webSearchItem, index) => {
                webSearchContext += `### 웹문서 아이템 ${index + 1}\n`
                webSearchContext += `- 제목 : ${webSearchItem.title}`
                webSearchContext += `- 내용 : ${webSearchItem.description}`
                webSearchContext += `- 링크 : ${decodeURI(webSearchItem.link)}`
                webSearchContext += `\n\n`
            })

            const htmlRemovedContext = removeHtmlTags(
                newsContext + blogContext + webSearchContext
            )
            return htmlRemovedContext
        } catch (error) {
            console.error('Error occurred during Naver search:', error)
        }
    }

    const translateEngToKor = () => {}

    // 마크다운 보고서 작성
    const makeMarkdownReport = async (
        question: string,
        context: string,
        imageUrl?: string,
        tableContents?: string
    ) => {
        console.log(`[makeMarkdownReport] imageUrl : ${imageUrl}`)
        const llmType = settings.selectedLLM

        if (llmType === LLMType.solar) {
            //한글 -> 영어 번역 수행
        }

        return await apiClient.fetchReportMarkdown(
            question,
            context,
            imageUrl,
            tableContents,
            llmType
        )
    }

    function generateRandomNumber(length: number = 15): number {
        const characters = '0123456789'
        let result = ''

        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length)
            result += characters.charAt(randomIndex)
        }

        return parseInt(result, 10)
    }

    const handleSubmit = async (message: string) => {
        if (!message.trim()) {
            return
        }

        setPrevMarkdown(markdown) //이전 마크다운을 롤백용으로 저장한다.
        const combinedSelectedText = Array.from(selectedSentences).join('') // 유저가 선택된 문장
        // 유저가 선택한 부분을 프롬프트에 넣어준다.
        const userBubbleId = generateRandomNumber()
        const userChatMessageForUI: IChatMessage = {
            content: question,
            role: 'user',
            bubbleId: userBubbleId,
        }

        const userBubbleIdTemp = generateRandomNumber()
        const prompt = getPrompt(
            LLMTasks.fixReport,
            question,
            markdown,
            combinedSelectedText
        )

        const userChatMessageForRequest: IChatMessage = {
            content: prompt,
            role: 'user',
            bubbleId: userBubbleIdTemp,
        }

        setMessages((prevMessages) => [...prevMessages, userChatMessageForUI])

        const botBubbleId = generateRandomNumber()
        const assistantChatMessage: IChatMessage = {
            content: '응답을 기다리고 있습니다. 😊',
            role: 'assistant',
            bubbleId: botBubbleId,
            isLoading: true,
        }

        setMessages((prevMessages) => [...prevMessages, assistantChatMessage])

        try {
            const response = await apiClient.fetchChatResponse([
                userChatMessageForRequest,
            ])

            if (response.success) {
                setMessages((prevMessages) =>
                    prevMessages.map((msg) => {
                        const content = '요청하신 작업이 완료되었습니다!'
                        return msg.bubbleId === botBubbleId
                            ? { ...msg, content: content, isLoading: false }
                            : msg
                    })
                )
                setMarkdown(response.data)
                return
            } else {
                setMessages((prevMessages) =>
                    prevMessages.map((msg) =>
                        msg.bubbleId === botBubbleId
                            ? {
                                  ...msg,
                                  content:
                                      '죄송합니다. 응답을 처리하는 데 문제가 발생했습니다.',
                                  isLoading: false,
                              }
                            : msg
                    )
                )
                // 작업이 실패한 경우, 롤백용 마크다운은 없앤다.
                setPrevMarkdown(undefined)
            }
        } catch (error) {
            console.error('Error fetching assistant response:', error)
            setMessages((prevMessages) =>
                prevMessages.map((msg) =>
                    msg.bubbleId === botBubbleId
                        ? {
                              ...msg,
                              content:
                                  '죄송합니다. 응답을 처리하는 데 문제가 발생했습니다.',
                          }
                        : msg
                )
            )
        } finally {
            // 채팅 요청을 한 이후, 선택된 항목들을 해제한다.
            setSelectedSentences(new Set())
        }
    }

    // DALL·E API 호출 함수
    const generateDalleImage = async (question: string) => {
        try {
            // 키워드를 영어로 번역
            const translationResponse =
                await apiClient.fetchTranslateKeywordsToEnglish(question) // 이름 ��경

            if (!translationResponse.success) {
                console.error(
                    'Failed to translate keywords:',
                    translationResponse.error
                )
                return undefined
            }

            const translatedKeywords = translationResponse.data
            console.log('Translated Keywords:', translatedKeywords)

            // 번역된 키워드를 사용하여 DALL·E 응답 요청
            const response =
                await apiClient.fetchDallEResponse(translatedKeywords)

            if (response.success) {
                return response.data
            }

            return undefined
        } catch (e) {
            console.error('Error generating DALL·E image:', e)
            return undefined
        }
    }

    const initialize = async () => {
        try {
            setLoading(true)

            const question = draftData.question ?? ''
            let keywords = draftData.keywords ?? ''
            let imageUrl = undefined
            const tableContents = draftData.tableContents ?? ''

            // 달리가 활성화 되어있는 경우에만 생성한다.
            if (draftData.useDalle) {
                // 1. keyword가 입력되어 있지 않을 경우, 이미지 생성용 키워드를 생성한다.
                if (keywords.length === 0) {
                    setLoadingMessage(
                        '이미지 생성을 위한 키워드를 생성하고 있어요'
                    )
                    keywords = (await apiClient.fetchKeywordForDalle(question))
                        .data
                }

                setLoadingMessage('이미지를 그리고 있어요..')
                // 2. 보고서용 이미지 생성
                console.log('Keywords:', keywords)
                imageUrl = await generateDalleImage(keywords)
            }

            // 3. 네이버에서 가져온 context들 (없으면 안들어감)
            const contextInNaverSearch = draftData.naverSearchItems
                .map(
                    (naverSearchItem, index) =>
                        `## 검색결과 ${index + 1}:\n- 제목 : ${naverSearchItem.title}\n- 내용 : ${naverSearchItem.description}\n- 링크 : ${decodeURI(naverSearchItem.link)}\n`
                )
                .join('\n')

            const naverSearchLinkText = draftData.naverSearchItems
                .map(
                    (naverSearchItem, index) =>
                        `- <a href="${naverSearchItem.link}" target="_blank">${naverSearchItem.title}</a>\n`
                )
                .join('\n')

            // 4. 문서 가져온 context들 (없으면 안들어감)
            const contextInDocs = draftData.docContents
                .map((doc, index) => `## 문서 ${index + 1}:\n${doc}\n\n`)
                .join('\n')

            // 5. 기재한 url에서 context들 (없으면 안들어감)
            const contextInUrls = draftData.urlContents.map(
                (urlContent, index) =>
                    `## 웹 문서 ${index + 1}:\n- 내용 : ${urlContent}\n`
            )

            // ��텍스트가 머지될 변수이다.
            let reportContext = ''

            // 키워드 머지
            if (keywords.length !== 0)
                reportContext = `### 키워드 : ${keywords}\n\n` + reportContext

            // 네이버 검색결과
            if (contextInNaverSearch.length !== 0)
                reportContext = reportContext + contextInNaverSearch

            // 문서 검색결과
            if (contextInDocs.length !== 0)
                reportContext = reportContext + contextInDocs

            // URL 검색결과
            // fix: - body 내의 html 만 파싱하게 변경해야함
            // if (contextInUrls.length !== 0)
            //     reportContext = reportContext + contextInUrls

            setLoadingMessage(
                '보고서를 생성하고 있습니다! 잠시만 기다려주세요!'
            )

            // 최종적으로 보고서를 생성한다.
            const reportMarkdown = await makeMarkdownReport(
                question,
                reportContext,
                imageUrl,
                tableContents
            )

            setMarkdown(
                reportMarkdown.data +
                    '\n\n### 참고 자료\n' +
                    naverSearchLinkText
            )
        } catch (e) {
            alert(`에러가 발생하여, 메인화면으로 이동합니다.\n\n${e}`)
            router.push(appRoutes.index)
        } finally {
            setLoading(false)
        }
    }

    const goToNextPage = () => {}

    const handleGoToEdit = () => {
        setVisiblePdfEditModal(true)
    }

    useEffect(() => {
        initialize()
    }, [])

    useEffect(() => {
        if (messages.length > 0) {
            setQuestion('')
        }
    }, [messages])

    return loading ? (
        <LoadingShimmer message={loadingMessage} />
    ) : (
        <>
            <div className={'w-screen h-screen flex'}>
                <HorizontalNavbar />
                <ChatWithMarkdownUI
                    messages={messages}
                    question={question}
                    setQuestion={setQuestion}
                    setMessages={setMessages}
                    handleMessage={handleSubmit}
                    selectedSentences={selectedSentences}
                    setSelectedSentences={setSelectedSentences}
                    markdown={markdown}
                    setMarkdown={setMarkdown}
                    setPrevMarkdown={setPrevMarkdown}
                    prevMarkdown={prevMarkdown}
                    handleGoToEdit={handleGoToEdit}
                />
            </div>
            <EditMarkdownModal
                markdown={markdown}
                isOpen={visiblePdfEditModal}
                onClose={() => {
                    setVisiblePdfEditModal(false)
                }}
                onSave={goToNextPage}
            />
        </>
    )
}
