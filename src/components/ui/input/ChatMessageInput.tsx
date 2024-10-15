'use client'

import React, { useRef, ChangeEvent, useState } from 'react'
import { ArrowRight, PlusCircle, SendIcon, SettingsIcon, X } from 'lucide-react'
import SizedBox from '@/components/ui/box/SizedBox'
import { IChatMessage } from '@/interfaces/common/IChatMessage'
import { message, Select, Switch, Tooltip } from 'antd'

interface MessageInputProps {
    question: string
    files: File[]
    isDragging: boolean
    setQuestion: (value: string) => void
    setFiles: (files: File[]) => void
    setIsDragging: (value: boolean) => void
    onGenOptionButtonClicked: (message: string, files: File[]) => void
    onGoToNextPageButtonClicked?: () => void
    placeholder?: string // placeholder 속성 추가
}

const ChatMessageInput: React.FC<MessageInputProps> = ({
    question,
    files,
    isDragging,
    setQuestion,
    setFiles,
    setIsDragging,
    onGenOptionButtonClicked,
    onGoToNextPageButtonClicked,
    placeholder, // placeholder 속성 추가
}) => {
    const [messageApi, contextHolder] = message.useMessage()
    const inputRef = useRef<HTMLTextAreaElement>(null)
    const [isFocused, setIsFocused] = useState(false)

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(true)
    }

    const handleDragLeave = () => {
        setIsDragging(false)
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)
        const droppedFiles = Array.from(e.dataTransfer.files)
        setFiles([...files, ...droppedFiles])
    }

    const handleGenOption = () => {
        onGenOptionButtonClicked(question, files)
    }

    const handleSubmit = () => {
        if (question.trim() === '') {
            messageApi.error('검색어를 입력해주세요.')
            return
        }

        onGoToNextPageButtonClicked?.()
    }

    const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter') {
            handleSubmit()
        }
    }

    const handleRemoveFile = (index: number) => {
        setFiles(files.filter((_, i) => i !== index))
    }

    return (
        <>
            {contextHolder}
            <div
                className={`
                border rounded-lg shadow-sm hover:shadow-lg  transition-shadow duration-300
                ${isDragging ? 'border-[2px] border-blue-400 border-dashed' : 'border-gray-300'}
                ${isFocused ? 'border-gray-300' : 'border-1'}
            `}
                style={{ boxSizing: 'border-box' }}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                <div className="flex flex-col items-start p-[16px]">
                    {/* 입력 부분 */}
                    <textarea
                        ref={inputRef}
                        placeholder={placeholder} // placeholder 속성 사용
                        onFocus={() => setIsFocused(true)} // 포커스될 때 isFocused를 true로 변경
                        onBlur={() => setIsFocused(false)} // 포커스가 벗어났을 때 isFocused를 false로 변경
                        className="flex-grow w-full h-[60px] border-none bg-transparent border-0 focus:outline-none focus:border-0 ring-0 active:border-0 text-gray-800 placeholder-gray-500 text-[16px] resize-none"
                        value={question}
                        onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                            setQuestion(e.target.value)
                        }
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault() // Enter 입력시 줄바꿈 방지
                                handleKeyPress(e) // 입력 내용이 있을 때만 제출
                            }
                        }}
                    />

                    <SizedBox height={8} />

                    {/* 아랫 부분 */}
                    <div className={'flex w-full items-center'}>
                        {/* 파일 첨부 기능 제거 */}
                        <div className={'flex-1'} />

                        {/* 글자수 */}
                        <div className={'flex items-end h-[28px] mr-[8px]'}>
                            <span className={'text-[12px]'}>
                                {question.length}/{1000}
                            </span>
                        </div>

                        {/* 보내기 버튼과 세부 설정 문구 */}
                        {/*<div className="flex flex-col items-center">*/}
                        {/*    <Tooltip title={'보고서 생성 세부 설정'}>*/}
                        {/*        <button*/}
                        {/*            onClick={handleGenOption}*/}
                        {/*            className={`flex items-center justify-center w-[32px] h-[32px] rounded-lg cursor-pointer duration-100`}*/}
                        {/*        >*/}
                        {/*            <SettingsIcon className="h-[24px] w-[24px] font-light text-gray-500" />*/}
                        {/*        </button>*/}
                        {/*    </Tooltip>*/}
                        {/*</div>*/}

                        <SizedBox width={4} />

                        <Tooltip title={'초안 생성 시작'}>
                            <button
                                onClick={handleGenOption}
                                aria-label="메시지 전송"
                                className={`flex items-center justify-center w-[32px] h-[32px] rounded-lg bg-violet-700 cursor-pointer hover:bg-violet-500 transition-colors duration-100`}
                            >
                                <SendIcon className="h-[16px] w-[16px] text-white" />
                            </button>
                        </Tooltip>
                    </div>
                </div>

                {/* 첨부 파일 */}
                {files.length > 0 && (
                    <div
                        className={`overflow-hidden transition-all duration-300 ease-in-out 'max-h-0'`}
                    >
                        <div>
                            {files.map((file, index) => (
                                <div
                                    key={index}
                                    className={`flex pl-[16px] items-center justify-between bg-gray-100 p-2 shadow-sm 
            ${index == files.length - 1 ? 'rounded-b-lg' : ''}
            transition-opacity duration-1000 ease-in-out
          `}
                                    style={{
                                        transition: 'opacity 1s ease-in-out',
                                    }}
                                >
                                    <span className="text-sm truncate text-gray-700 font-bold">
                                        {file.name}
                                    </span>
                                    <button
                                        onClick={() => handleRemoveFile(index)}
                                        className="text-gray-500 hover:text-red-500 transition-colors duration-200"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </>
    )
}

export default ChatMessageInput
