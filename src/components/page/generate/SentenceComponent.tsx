import React from 'react'

interface SentenceComponentProps {
    children?: React.ReactNode
    onToggleSelect?: (sentence: string) => void
    isSelected?: boolean
}

const SentenceComponent: React.FC<SentenceComponentProps> = ({
    children,
    onToggleSelect,
    isSelected = false,
}) => {
    const handleClick = () => {
        if (onToggleSelect) {
            let textContent = ''

            if (Array.isArray(children)) {
                textContent = children.join('')
            } else if (
                typeof children === 'string' ||
                typeof children === 'number'
            ) {
                textContent = children.toString()
            }

            if (textContent.length > 0) {
                onToggleSelect(textContent)
            }
        }
    }

    return (
        <span
            style={{
                backgroundColor: isSelected ? '#ccff90' : 'transparent', // 선택 시 형광펜과 같은 초록색
                cursor: 'pointer', // 커서 포인터로 설정
            }}
            onClick={handleClick}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    handleClick()
                }
            }}
            role="button"
            aria-pressed={isSelected}
            tabIndex={0}
        >
            {children}
        </span>
    )
}

export default SentenceComponent
