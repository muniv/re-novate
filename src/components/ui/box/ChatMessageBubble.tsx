import { motion } from 'framer-motion'
import React from 'react'
import { IChatMessage } from '@/interfaces/common/IChatMessage'
import SizedBox from '@/components/ui/box/SizedBox'
import { Spin } from 'antd'

interface ChatMessageBubbleProps {
    message: IChatMessage
}

const ChatMessageBubble: React.FC<ChatMessageBubbleProps> = ({ message }) => {
    return (
        <motion.div>
            <div
                className={`flex w-full ${message.role == 'assistant' ? 'justify-start' : 'justify-start'}`}
            >
                <div>
                    <div className="font-bold">
                        {message.role == 'assistant' ? '✨ Re:novate' : '🧑 User'}
                    </div>

                    <SizedBox height={8} />

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className={`w-fit px-[16px] py-[12px] rounded-lg ${
                            message.role == 'assistant'
                                ? 'self-start bg-purple-500 text-white'
                                : 'bg-gray-200 self-end'
                        }`}
                    >
                        {message.isLoading ? <Spin /> : message.content}
                    </motion.div>
                </div>
            </div>
        </motion.div>
    )
}

export default ChatMessageBubble
