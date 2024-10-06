import React, { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import Modal from 'react-modal'
import 'easymde/dist/easymde.min.css' // SimpleMDE 스타일을 임포트합니다.
import SizedBox from '@/components/ui/box/SizedBox'

// dynamic import를 사용하여 서버 사이드 렌더링 문제를 피합니다.
const SimpleMDE = dynamic(() => import('react-simplemde-editor'), {
    ssr: false,
})

interface Props {
    markdown?: string
    isOpen: boolean
    onClose: () => void
    onSave: (markdownContent: string) => void
}

export const EditMarkdownModal: React.FC<Props> = ({
    markdown,
    isOpen,
    onClose,
    onSave,
}) => {
    const [editorContent, setEditorContent] = useState(markdown || '')

    useEffect(() => {
        setEditorContent(markdown || '')
    }, [markdown])

    useEffect(() => {
        // DOM이 로드된 후에 Modal의 appElement를 설정
        const appElement = document.querySelector('#__next') || document.body
        Modal.setAppElement(appElement as HTMLElement)
    }, [])

    const handleSave = () => {
        onSave(editorContent)
        onClose()
    }

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            contentLabel="Edit Markdown"
            shouldCloseOnEsc={true}
            shouldCloseOnOverlayClick={true}
            style={{
                content: {
                    width: '210mm',
                    maxHeight: '90vh',
                    margin: 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                    padding: 0, // 기본 패딩을 제거합니다.
                },
            }}
        >
            {/* Editor Container */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <SimpleMDE
                    value={editorContent}
                    onChange={(e) => {
                        console.log(`onchanged : ${e}`)
                        setEditorContent(e)
                    }}
                    options={{
                        spellChecker: false,
                        toolbar: [
                            'bold',
                            'italic',
                            'heading',
                            '|',
                            'quote',
                            'code',
                            'table',
                            'horizontal-rule',
                            '|',
                            'preview',
                            'side-by-side',
                            'fullscreen',
                            '|',
                            'guide',
                        ],
                        status: false,
                        // autoRefresh: { delay: 500 },
                    }}
                    style={{
                        flex: 1,
                    }}
                />
            </div>

            {/* Fixed buttons at the bottom */}
            <div
                className="flex w-full justify-end items-center"
                style={{
                    position: 'sticky',
                    bottom: 0,
                    backgroundColor: 'white',
                    padding: '12px',
                    borderTop: '1px solid #ddd',
                    height: '60px', // 버튼 컨테이너의 높이 지정
                }}
            >
                <button
                    className="px-[16px] py-[4px] text-gray-300"
                    onClick={onClose}
                >
                    취소
                </button>
                <button
                    className="rounded px-[16px] py-[4px] bg-blue-500 text-white"
                    onClick={handleSave}
                >
                    확정
                </button>
            </div>
        </Modal>
    )
}
