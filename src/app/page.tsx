'use client'

import { useState } from 'react'
import { FileText, FileCheck2, Lightbulb, Languages } from 'lucide-react'
import GradientText from '@/components/ui/text/GradientText'
import ChatExampleBox from '@/components/ui/box/ChatExampleBox'
import SizedBox from '@/components/ui/box/SizedBox'
import ChatMessageInput from '@/components/ui/input/ChatMessageInput'
import { IChatExample } from '@/interfaces/common/IChatExample'
import { appRoutes, ChatExampleType } from '@/Constants'
import SearchDetailModal from '@/components/ui/modals/SearchDetailModal'
import { useRouter } from 'next/navigation'
import { useRecoilState } from 'recoil'
import { draftDataAtom } from '@/atoms/draftDataAtom'

export default function MainPage() {
    const router = useRouter()

    const [question, setQuestion] = useState('')
    const [attachedFiles, setAttachedFiles] = useState<File[]>([])
    const [isDragging, setIsDragging] = useState(false)
    const [genOptionModalOpen, setGenOptionModalOpen] = useState(false)
    const [urls, setUrls] = useState<string[]>([])
    const [keywords, setKeywords] = useState('')
    const [draftData, setDraftData] = useRecoilState(draftDataAtom)

    const chatExamples: IChatExample[] = [
        {
            title: 'Z세대의 소비 트렌드 분석',
            description:
                '#Z세대 #소비패턴 #마케팅전략',
            type: ChatExampleType.text,
            icon: <FileText className={'w-[20px] h-[20px] font-bold'} />,
        },
        {
            title: '인공지능 기반의 개인화 추천 시스템',
            description:
                '#개인화 #추천시스템 #사용자경험',
            type: ChatExampleType.text,
            icon: <Lightbulb className={'w-[20px] h-[20px] font-bold'} />,
        },
        {
            title: '하이브리드 근무 환경에서의 팀 협업 도구',
            description:
                '#원격근무 #협업도구 #팀효율성',
            type: ChatExampleType.text,
            icon: <FileCheck2 className={'w-[20px] h-[20px] font-bold'} />,
        },
        {
            title: '재생 에너지 기술의 경제적 영향',
            description:
                '#지속가능성 #환경보호',
            type: ChatExampleType.text,
            icon: <FileText className={'w-[20px] h-[20px] font-bold'} />,
        },
    ]

    const handleGenOption = () => {
        openGenOptionModal()
    }

    const openGenOptionModal = () => {
        setGenOptionModalOpen(true)
    }

    const onGoToNextPageButtonClicked = () => {
        setDraftData((prevDraftData) => ({
            ...prevDraftData,
            question: question,
            keywords: keywords,
            urls: urls,
            docFiles: attachedFiles,
            urlContents: [],
            docContents: [],
            naverSearchItems: [],
        }))

        router.push(appRoutes.confirm)
    }

    return (
        <main
            style={{
                background:
                    'radial-gradient(circle, rgba(238,174,202,0.485) 0%, rgba(148,187,233,0.527) 100%)',
                backdropFilter: 'blur(10px)',
                animation: 'backgroundAnimation 8s ease-in-out infinite',
                position: 'relative', // 원 애니메이션을 위한 상대 위치
                overflow: 'hidden', // 화면 밖으로 나가는 원들이 보이지 않도록 처리
            }}
            className="flex justify-center items-center w-screen h-screen mx-auto p-6 space-y-6 bg-white blur-animated-background"
        >
            {/* Floating circles */}
            <div className="floating-circles">
                {Array.from({ length: 10 }).map((_, index) => (
                    <div key={index} className="circle"></div>
                ))}
            </div>

            <div
                className={'flex flex-col px-[48px] py-[48px] rounded bg-white'}
            >
                <div className={"flex items-center"}>
                    <span className={'text-[48px]'}>💡</span>
                    <SizedBox width={8}/>
                    <GradientText fontSize={'50px'} bold={true}>
                        Re:novate
                    </GradientText>
                </div>

                <SizedBox height={4} />

                <div>
                    <span className={"font-[bold] text-[24px] text-gray-600 font-bold"}>
                        맞춤형 리포트를 빠르게 생성해 드릴게요.
                    </span>
                </div>

                <SizedBox height={4} />

                <span className={'text-gray-500 font-normal'}>
                    아래 예제중 하나를 골라 실행해보세요!
                </span>

                <SizedBox height={12} />

                {/* 예제 */}
                <div className={'flex gap-2'}>
                    {chatExamples.map((chatExample) => {
                        return (
                            <ChatExampleBox
                                key={chatExample.title}
                                onClick={
                                    () => setQuestion(chatExample.title ?? '') // title을 설정
                                }
                                title={chatExample.title ?? ''}
                                description={chatExample.description ?? ''}
                                icon={chatExample.icon}
                            />
                        )
                    })}
                </div>

                <SizedBox height={24} />

                <ChatMessageInput
                    question={question}
                    setQuestion={setQuestion}
                    files={attachedFiles}
                    setFiles={setAttachedFiles}
                    isDragging={isDragging}
                    setIsDragging={setIsDragging}
                    onGenOptionButtonClicked={handleGenOption}
                    onGoToNextPageButtonClicked={onGoToNextPageButtonClicked}
                    placeholder="어떤 문제를 해결하는 보고서를 만들까요?" // placeholder 속성 추가
                />
            </div>

            {/* 정보 입력 모달 */}
            <SearchDetailModal
                setModalOpen={setGenOptionModalOpen}
                modalOpen={genOptionModalOpen}
                question={question}
                setQuestion={setQuestion}
                files={attachedFiles}
                setFiles={setAttachedFiles}
                urls={urls}
                setUrls={setUrls}
                keywords={keywords}
                setKeywords={setKeywords}
            />
        </main>
    )
}
