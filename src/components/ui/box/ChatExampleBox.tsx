import React from 'react'
import SizedBox from '@/components/ui/box/SizedBox'

interface ExampleBoxProps {
    title: string
    description?: string
    icon: React.ReactNode
    onClick?: () => void
}

const ChatExampleBox: React.FC<ExampleBoxProps> = ({
    title,
    description,
    icon,
    onClick,
}) => {
    return (
        <div
            className="bg-white p-4 rounded-lg shadow-md flex flex-col border-[1px] border-gray-200 justify-between transition-transform duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
            style={{ width: '200px', height: '130px' }}
            onClick={onClick}
        >
            <p className="text-black text-sm font-medium">{title}</p>
            <SizedBox height={8} />
            <div className={'overflow-ellipsis'}>
                <span
                    className={'text-gray-500 text-[12px]'}
                    style={{
                        display: '-webkit-box',
                        WebkitBoxOrient: 'vertical',
                        WebkitLineClamp: 2,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                    }}
                >
                    {description}
                </span>
            </div>
            <SizedBox height={12} />
            <div className="flex justify-start items-center">
                <span className="text-gray-400 text-lg">{icon}</span>
            </div>
        </div>
    )
}

export default ChatExampleBox
