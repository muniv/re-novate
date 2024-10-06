import { Loader, Sparkles, SparklesIcon, Wand2Icon } from 'lucide-react'
import { Popover, Spin } from 'antd'
import React from 'react'
import { CgSpinner } from 'react-icons/cg'
import { Spinnaker } from 'next/dist/compiled/@next/font/dist/google'

interface Props {
    popOverText?: string
    onClick?: () => void
    isLoading?: boolean
}

const AiGenButton: React.FC<Props> = ({
    popOverText = 'AI로 생성하기',
    onClick,
    isLoading,
}) => {
    return (
        <Popover content={popOverText}>
            <div
                onClick={onClick}
                className="flex items-center justify-center w-[28px] h-[28px] rounded bg-violet-600 hover:bg-violet-500"
            >
                {isLoading ? (
                    <Spin size={'small'} style={{ color: 'white' }} />
                ) : (
                    <Wand2Icon
                        fill="#ffffff"
                        stroke={'#ffffff'}
                        width={16}
                        height={16}
                    />
                )}
            </div>
        </Popover>
    )
}

export default AiGenButton
