import React from 'react'
import { INaverSearchItem } from '@/interfaces/search/INaverSearch'
import { motion } from 'framer-motion'
import SizedBox from '@/components/ui/box/SizedBox'
import { openLinkInNewTab } from '@/util/WebUtil'

interface Props {
    index: number
    item: INaverSearchItem
    isSelected: boolean
    onToggleSelect: (itemIndex: number) => void
}

const NaverSearchItemComponent: React.FC<Props> = ({
    index,
    item,
    isSelected,
    onToggleSelect,
}) => {
    const getDomainIcon = (link: string) => {
        const domain = new URL(link).hostname
        if (domain.includes('tistory.com')) {
            return '/images/ic_tistory.png'
        }
        if (domain.includes('blog.naver.com')) {
            return '/images/ic_naver_blog.png'
        }
        if (domain.includes('naver.com')) {
            return '/images/ic_naver.png'
        }
        if (domain.includes('velog.io')) {
            return '/images/ic_velog.png'
        }
        if (domain.includes('wikipedia.org')) {
            return '/images/ic_wikipedia.png'
        }
        if (domain.includes('namu.wiki')) {
            return '/images/ic_namuwiki.jpeg'
        }
        return '/images/ic_web.png'
    }

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
                    e.stopPropagation() // prevent triggering link click
                    onToggleSelect(index)
                }}
                className="form-checkbox cursor-pointer min-h-[24px] min-w-[24px] text-purple-500"
            />
            <div
                className="flex flex-col flex-1 cursor-pointer overflow-hidden"
                onClick={() => openLinkInNewTab(item.link)}
            >
                <div className="flex items-center space-x-2">
                    <img
                        src={getDomainIcon(item.link)}
                        alt="Domain Icon"
                        className="w-[24px] h-[24px]"
                    />
                    <span className="mt-[2px] font-semibold truncate text-[16px] max-w-full">
                        {item.title}
                    </span>
                </div>
                <SizedBox height={8} />
                <span
                    className="text-gray-500 text-[14px] overflow-hidden"
                    style={{
                        display: '-webkit-box',
                        WebkitLineClamp: 3, // Limits to 3 lines
                        WebkitBoxOrient: 'vertical',
                        textOverflow: 'ellipsis',
                        overflow: 'hidden',
                    }}
                >
                    {item.description}
                </span>
            </div>
        </motion.div>
    )
}

export default NaverSearchItemComponent
