import React from 'react'
import { motion } from 'framer-motion'
import SizedBox from '@/components/ui/box/SizedBox'
import { openLinkInNewTab } from '@/util/WebUtil'

interface Props {
    index: number
    content: string
    url: string
    isSelected: boolean
    onToggleSelect: (itemIndex: number) => void
}

const UrlContentItemComponent: React.FC<Props> = ({
    index,
    content,
    url,
    isSelected,
    onToggleSelect,
}) => {
    return (
        <motion.div
            className={`flex items-center space-x-4 p-4 border rounded-lg ${
                isSelected ? 'bg-blue-100' : 'bg-white'
            }`}
            whileHover={{
                scale: 1.03,
                boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
            }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            style={{ overflow: 'hidden' }} // Prevent content overflow
        >
            <input
                type="checkbox"
                checked={isSelected}
                onChange={(e) => {
                    e.stopPropagation()
                    onToggleSelect(index)
                }}
                className="form-checkbox cursor-pointer min-h-[24px] min-w-[24px] text-purple-500"
            />
            <div
                onClick={() => {
                    openLinkInNewTab(url)
                }}
                className="flex flex-col flex-1 cursor-pointer overflow-hidden"
            >
                <div className="flex items-center space-x-2">
                    <img
                        src={'/images/ic_web.png'}
                        alt="Domain Icon"
                        className="w-[24px] h-[24px]"
                    />
                    <span className="mt-[2px] font-semibold truncate text-[16px] max-w-full">
                        {url}
                    </span>
                </div>
                <SizedBox height={8} />
                <div
                    className="text-gray-500 text-[14px] overflow-hidden"
                    style={{
                        display: '-webkit-box',
                        WebkitLineClamp: 3, // Limits to 3 lines
                        WebkitBoxOrient: 'vertical',
                        textOverflow: 'ellipsis',
                        overflow: 'hidden',
                    }}
                >
                    {content}
                </div>
            </div>
        </motion.div>
    )
}

export default UrlContentItemComponent
