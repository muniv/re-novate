// ChatWithMarkdownUI.tsx
import React, { useState, useCallback, useRef, useEffect } from 'react'
import {
    ArrowRightIcon,
    CheckIcon,
    DownloadIcon,
    EditIcon,
    SendIcon,
    ShareIcon,
} from 'lucide-react'
import { IChatMessage } from '@/interfaces/common/IChatMessage'
import SizedBox from '@/components/ui/box/SizedBox'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import ChatMessageBubble from '@/components/ui/box/ChatMessageBubble'
import remarkSplitSentences from '@/util/TextUtils'
import SentenceComponent from '@/components/page/generate/SentenceComponent'
import { Tooltip } from 'antd'
import pdfMake from 'pdfmake/build/pdfmake'
import pdfFonts from 'pdfmake/build/vfs_fonts'
import { loadFont } from '@/util/FontUtil'
import htmlToPdfmake from 'html-to-pdfmake'

import rehypeRaw from 'rehype-raw' // HTML을 지원하기 위해 필요
import 'github-markdown-css'
import { RollbackOutlined } from '@ant-design/icons' // GitHub 스타일 CSS를 적용 (선택 사항)

pdfMake.vfs = pdfFonts.pdfMake.vfs

interface Props {
    markdown?: string
    setMarkdown?: React.Dispatch<React.SetStateAction<string>>
    prevMarkdown?: string
    setPrevMarkdown: React.Dispatch<React.SetStateAction<string | undefined>>
    question?: string
    setQuestion: React.Dispatch<React.SetStateAction<string>>
    messages: IChatMessage[]
    setMessages: React.Dispatch<React.SetStateAction<IChatMessage[]>>
    selectedSentences: Set<string>
    setSelectedSentences: React.Dispatch<React.SetStateAction<Set<string>>>
    handleMessage?: (message: string) => void
    handleGoToEdit?: () => void
}

const ChatWithMarkdownUI: React.FC<Props> = ({
    markdown = '',
    setMarkdown,
    prevMarkdown,
    setPrevMarkdown,
    messages,
    setMessages,
    handleMessage,
    question = '',
    setQuestion,
    selectedSentences,
    setSelectedSentences,
    handleGoToEdit,
}) => {
    const [leftWidth, setLeftWidth] = useState(50)
    const [isResizing, setIsResizing] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const chatRef = useRef<HTMLDivElement>(null)
    const markdownContentRef = useRef<HTMLDivElement>(null)

    const toggleSentenceSelection = (sentence: string) => {
        setSelectedSentences((prev) => {
            const newSet = new Set(prev)
            if (newSet.has(sentence)) {
                newSet.delete(sentence)
            } else {
                newSet.add(sentence)
            }
            return newSet
        })
    }

    const handleMouseDown = useCallback(() => {
        setIsResizing(true)
    }, [])

    const handleMouseMove = useCallback(
        (e: MouseEvent) => {
            if (isResizing) {
                // 반대로 움직이도록 계산
                const newLeftWidth =
                    ((window.innerWidth - e.clientX) / window.innerWidth) * 100
                if (newLeftWidth >= 10 && newLeftWidth <= 90) {
                    setLeftWidth(newLeftWidth)
                }
            }
        },
        [isResizing]
    )

    const handleMouseUp = useCallback(() => {
        setIsResizing(false)
    }, [])

    useEffect(() => {
        if (isResizing) {
            window.addEventListener('mousemove', handleMouseMove)
            window.addEventListener('mouseup', handleMouseUp)
        } else {
            window.removeEventListener('mousemove', handleMouseMove)
            window.removeEventListener('mouseup', handleMouseUp)
        }
        return () => {
            window.removeEventListener('mousemove', handleMouseMove)
            window.removeEventListener('mouseup', handleMouseUp)
        }
    }, [isResizing, handleMouseMove, handleMouseUp])

    useEffect(() => {
        if (chatRef.current) {
            chatRef.current.scrollTop = chatRef.current.scrollHeight
        }
    }, [messages])

    const handleSubmit = () => {
        if (!isSubmitting && question) {
            setIsSubmitting(true)
            handleMessage?.(question)
            setTimeout(() => {
                setIsSubmitting(false)
                setQuestion('')
            }, 100)
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault()
            handleSubmit()
        }
    }

    const handleDownloadPDF = async () => {
        if (typeof window === 'undefined') return

        const markdownElement = markdownContentRef.current
        if (!markdownElement) return

        // html2pdf.js 동적 임포트
        const html2pdf = (await import('html2pdf.js')).default

        // 필요한 경우 마크다운 콘텐츠 복제 및 스타일 조정
        const clonedElement = markdownElement.cloneNode(true) as HTMLElement

        // 필요한 스타일 적용 (인라인 스타일 또는 스타일 태그 사용)
        // 예를 들어, 폰트 크기, 색상 등을 인라인 스타일로 적용
        // 또는 전체 스타일을 문자열로 만들어 `<style>` 태그로 추가

        // PDF 옵션 설정
        const opt = {
            margin: [12, 20, 12, 12],
            filename: 'markdown-content.pdf',
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
            // 페이지 분할 옵션 설정
            pagebreak: { mode: ['css', 'legacy'] },
        }

        // PDF 생성
        html2pdf().set(opt).from(clonedElement).save()
    }

    const handleRollback = () => {
        setMarkdown?.(() => prevMarkdown ?? '')
        setPrevMarkdown(() => undefined)
        setSelectedSentences(new Set())
    }

    const isWaitingResponse =
        messages.filter((message) => message.isLoading ?? false).length > 0

    return (
        <div className="w-full flex justify-between items-center bg-gray-100 h-full p-4">
            <div
                className="flex-1 h-full p-8 overflow-y-auto rounded-lg bg-white border-[1px] border-gray-300"
                style={{ width: `${100 - leftWidth}%` }}
            >
                <div id="markdown-body" ref={markdownContentRef}>
                    <ReactMarkdown
                        remarkPlugins={[remarkGfm, remarkSplitSentences]}
                        rehypePlugins={[rehypeRaw]} // HTML 태그를 포함한 마크다운 렌더링
                        components={{
                            p: ({ node, children, ...props }) => {
                                // children을 문자열로 변환
                                let textContent = ''

                                if (Array.isArray(children)) {
                                    textContent = children.join('')
                                } else if (
                                    typeof children === 'string' ||
                                    typeof children === 'number'
                                ) {
                                    textContent = children.toString()
                                }

                                return (
                                    <SentenceComponent
                                        {...props}
                                        isSelected={selectedSentences.has(
                                            textContent
                                        )}
                                        onToggleSelect={toggleSentenceSelection}
                                    >
                                        {children}
                                    </SentenceComponent>
                                )
                            },
                        }}
                        className="prose"
                    >
                        {markdown}
                    </ReactMarkdown>
                </div>
            </div>

            <div
                className="h-[80px] w-[4px] rounded-lg mx-[24px] bg-gray-300 cursor-col-resize"
                onMouseDown={handleMouseDown}
            ></div>

            <div
                className="flex flex-col h-full rounded-lg bg-white p-8 border-[1px] border-gray-300"
                style={{ width: `${leftWidth}%` }}
            >
                <div className="flex-1 overflow-y-auto space-y-4" ref={chatRef}>
                    {messages.map((message, index) => (
                        <MemoizedChatMessageBubble
                            key={index}
                            message={message}
                        />
                    ))}
                </div>

                <SizedBox width={24} />

                <div className="flex mt-4">
                    <input
                        type="text"
                        className="flex-1 border border-gray-300 rounded-lg pl-[12px] text-[14px] text-[#333333] focus:outline-none focus:border-purple-500 box-border resize-none"
                        placeholder="메시지를 입력해주세요."
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />

                    <button
                        onClick={handleSubmit}
                        disabled={question === ''}
                        aria-label="Send message"
                        className="ml-2 flex items-center justify-center w-[40px] h-[40px] rounded-lg bg-purple-700 text-white"
                    >
                        <SendIcon className="w-[20px] h-[20px]" />
                    </button>
                </div>
            </div>

            {/* Floating download button */}
            <Tooltip title={'PDF 다운로드'}>
                <button
                    onClick={handleDownloadPDF}
                    className="fixed bottom-8 right-[calc(50%+50px)] flex items-center justify-center w-[40px] h-[40px] bg-blue-500 text-white rounded-lg shadow-lg"
                >
                    <DownloadIcon className={'w-[20px] h-[20px]'} />
                </button>
            </Tooltip>

            {/* 롤백 */}
            {prevMarkdown && !isWaitingResponse && (
                <Tooltip title={'되돌리기'}>
                    <button
                        onClick={handleRollback}
                        className="fixed bottom-[84px] right-[calc(50%+50px)] flex items-center justify-center w-[40px] h-[40px] bg-gray-400 text-white rounded-lg shadow-lg"
                    >
                        <RollbackOutlined className={'w-[20px] h-[20px]'} />
                    </button>
                </Tooltip>
            )}
        </div>
    )
}

export default ChatWithMarkdownUI

const MemoizedChatMessageBubble = React.memo(ChatMessageBubble)
