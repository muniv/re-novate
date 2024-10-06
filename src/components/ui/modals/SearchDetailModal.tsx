import {
    Button,
    Input,
    message,
    Modal,
    Popover,
    Select,
    Space,
    Switch,
    Typography,
} from 'antd'
import React, { useState, useRef } from 'react'
import SizedBox from '@/components/ui/box/SizedBox'
import AiGenButton from '@/components/ui/button/AiGenIcon'
import apiClient from '@/lib/apiClient'
import UrlInput from '@/components/ui/input/UrlInput'
import { X, PlusCircle } from 'lucide-react'
import { useRecoilState } from 'recoil'
import { draftDataAtom } from '@/atoms/draftDataAtom'

interface SearchDetailModalProps {
    modalOpen: boolean
    setModalOpen: (open: boolean) => void
    question?: string
    setQuestion: (question: string) => void
    files: File[]
    setFiles: (files: File[]) => void
    urls: string[]
    setUrls: React.Dispatch<React.SetStateAction<string[]>>
    keywords: string
    setKeywords: React.Dispatch<React.SetStateAction<string>>
}

const SearchDetailModal: React.FC<SearchDetailModalProps> = ({
    modalOpen,
    setModalOpen,
    question,
    setQuestion,
    files,
    setFiles,
    urls,
    setUrls,
    keywords,
    setKeywords,
}) => {
    const [messageApi, contextHolder] = message.useMessage()
    const [isKeywordLoading, setIsKeywordLoading] = useState(false)
    const [draftData, setDraftData] = useRecoilState(draftDataAtom)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const [reArrangeQuestionLoading, setReArrangeQuestionLoading] =
        useState(false)

    const generateKeywords = async () => {
        try {
            setIsKeywordLoading(true)
            const keywords = await apiClient.fetchKeyword(question ?? '')
            setKeywords(keywords.data)
        } finally {
            setIsKeywordLoading(false)
            messageApi.success('키워드가 생성되었습니다!')
        }
    }

    const reArrangeQuestion = async () => {
        try {
            setReArrangeQuestionLoading(true)
            const newQuestion = await apiClient.fetchRearrangedQuestion(
                question ?? ''
            )
            setQuestion(newQuestion.data)
        } finally {
            setReArrangeQuestionLoading(false)
        }
    }

    const handleQueryCountChange = (value: number) => {
        setDraftData((prevDraftData) => ({
            ...prevDraftData,
            searchQueryCount: value,
        }))
    }

    const handleDalleToggle = (checked: boolean) => {
        setDraftData((prevDraftData) => ({
            ...prevDraftData,
            useDalle: checked,
        }))
    }

    const handleFileChange = (selectedFiles: File[]) => {
        setFiles([...files, ...selectedFiles])
    }

    return (
        <>
            {contextHolder}
            <Modal
                title={
                    <Typography.Title level={3}>
                        📄 보고서 생성 세부 설정
                    </Typography.Title>
                }
                centered
                open={modalOpen}
                okText={'확인'}
                cancelText={'취소'}
                style={{
                    paddingTop: '48px',
                    paddingBottom: '48px',
                }}
                onOk={() => {
                    setModalOpen(false)
                }}
                onCancel={() => setModalOpen(false)}
            >
                <div className={'flex flex-col py-[12px] gap-[36px]'}>
                    {/* (1) 보고서 주제 */}
                    <div className={'flex flex-col  gap-[12px]'}>
                        <span className={'text-[20px] font-bold'}>
                            📝 보고서 주제
                        </span>
                        <div className={'flex flex-col items-start gap-[8px]'}>
                            <span className={'w-[48px] font-bold'}>질문</span>
                            <div className={'flex w-full items-center'}>
                                <Input
                                    className={'flex-1'}
                                    onChange={(e) => {
                                        setQuestion(e.target.value)
                                    }}
                                    placeholder={'질문을 입력해주세요.'}
                                    value={question}
                                />
                                <SizedBox width={8} />
                                <AiGenButton
                                    popOverText={'AI로 생성하기'}
                                    isLoading={reArrangeQuestionLoading}
                                    onClick={reArrangeQuestion}
                                />
                            </div>
                        </div>

                        <div className={'flex flex-col items-start gap-[8px]'}>
                            <span className={'w-[48px] font-bold'}>키워드</span>
                            <div className={'flex w-full items-center'}>
                                <Input
                                    className={'flex-1'}
                                    onChange={(e) => {
                                        setKeywords(e.target.value)
                                    }}
                                    placeholder={'키워드를 입력해주세요.'}
                                    value={keywords}
                                />
                                <SizedBox width={8} />
                                <AiGenButton
                                    onClick={generateKeywords}
                                    isLoading={isKeywordLoading}
                                />
                            </div>
                        </div>

                        <div className={'flex flex-col w-full items-start'}>
                            <span className={'w-fit font-bold'}>
                                표지 이미지 생성
                            </span>
                            <SizedBox height={4} />
                            <span className={'w-fit text-[12px] text-gray-400'}>
                                보고서에 어울리는 AI 이미지 생성을 활성화합니다.
                            </span>
                            <SizedBox height={8} />
                            <Switch
                                checked={draftData.useDalle}
                                onChange={handleDalleToggle}
                            />
                        </div>
                    </div>

                    {/* (2) 외부지식 (웹검색) */}
                    <div className={'flex flex-col  gap-[12px]'}>
                        <span className={'text-[20px] font-bold'}>
                            🌐 외부지식 (웹검색)
                        </span>
                        <div className={'flex flex-col items-start gap-[8px]'}>
                            <span className={'w-[48px] font-bold'}>URL</span>
                            <UrlInput urls={urls} setUrls={setUrls} />
                        </div>

                        <div className={'flex flex-col w-full items-start'}>
                            <span className={'w-fit font-bold'}>
                                웹검색 개수
                            </span>
                            <SizedBox height={4} />
                            <span className={'w-fit text-[12px] text-gray-400'}>
                                네이버 뉴스, 블로그, 웹을 통해 자료를 요청하는
                                개수입니다.
                            </span>
                            <SizedBox height={8} />
                            <Select
                                value={draftData.searchQueryCount}
                                onChange={handleQueryCountChange}
                                style={{
                                    width: '100px',
                                }}
                                options={[
                                    { value: 1, label: '1개' },
                                    { value: 3, label: '3개' },
                                    { value: 5, label: '5개' },
                                    { value: 10, label: '10개' },
                                ]}
                                className="w-[60px]"
                            />
                        </div>
                    </div>

                    {/* (3) 내부지식 (문서) */}
                    <div className={'flex flex-col  gap-[12px]'}>
                        <span className={'text-[20px] font-bold'}>
                            📂 내부지식 (문서)
                        </span>
                        <div
                            className={
                                'flex flex-col w-full items-start gap-[8px]'
                            }
                        >
                            <span className={'w-fit font-bold'}>첨부 파일</span>
                            <div
                                className={
                                    'flex items-end cursor-pointer hover:text-gray-400'
                                }
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <button
                                    aria-label="파일 첨부"
                                    className="text-gray-500 transition-colors duration-200"
                                >
                                    <PlusCircle
                                        className={'w-[16px] h-[16px]'}
                                    />
                                </button>
                                <SizedBox width={4} />
                                <span
                                    className={
                                        'text-gray-500 text-[14px] h-[18px]'
                                    }
                                >
                                    파일 첨부하기
                                </span>
                            </div>
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                onChange={(e) =>
                                    handleFileChange(
                                        Array.from(e.target.files || [])
                                    )
                                }
                                multiple
                            />
                            {files.map((file, index) => (
                                <div
                                    key={index}
                                    className={`flex px-[16px] w-full py-[8px] items-center justify-between bg-gray-100 p-0 shadow-sm rounded transition-opacity duration-1000 ease-in-out`}
                                    style={{
                                        transition: 'opacity 1s ease-in-out',
                                    }}
                                >
                                    <span className="text-sm truncate text-gray-700 font-bold">
                                        {file.name}
                                    </span>
                                    <button
                                        onClick={() => {
                                            setFiles(
                                                files.filter(
                                                    (_, i) => i !== index
                                                )
                                            )
                                        }}
                                        className="text-gray-500 hover:text-red-500 transition-colors duration-200"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </Modal>
        </>
    )
}

export default SearchDetailModal
