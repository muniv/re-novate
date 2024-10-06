'use client'

import { AnimatePresence, motion } from 'framer-motion'
import GradientText from '@/components/ui/text/GradientText'
import { useEffect, useState } from 'react'
import circle from '@/../public/lottie/circle.json'
import working from '@/../public/lottie/circle.json'
import SizedBox from '@/components/ui/box/SizedBox'
import Lottie from 'react-lottie-player'

interface Props {
    message?: string
}

const LoadingShimmer: React.FC<Props> = ({
    message = '잠시만 기다려주세요!',
}) => {
    const [currentMessageIndex, setCurrentMessageIndex] = useState(0)

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-white">
            <div className={'w-[160px] h-[160px]'}>
                <Lottie loop animationData={working} play />
            </div>
            <SizedBox height={24} />

            <div className="text-2xl font-bold mb-8">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentMessageIndex}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.5 }}
                    >
                        <GradientText fontSize={'28px'}>{message}</GradientText>
                    </motion.div>
                </AnimatePresence>
            </div>
            <div className="w-64 md:w-80 lg:w-96 space-y-4">
                {[...Array(3)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="relative overflow-hidden rounded-full"
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }} // 0.2초씩 차이를 줌
                    >
                        <div
                            className={`bg-white bg-opacity-20 rounded-full ${i === 0 ? 'h-8' : 'h-4'}`}
                        ></div>
                        <motion.div
                            className="absolute top-0 left-0 right-0 bottom-0 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 rounded-full"
                            animate={{
                                x: ['-100%', '100%'],
                            }}
                            transition={{
                                repeat: Infinity,
                                duration: 2 + i * 0.5, // 각 요소마다 반복 시간 조금 다르게
                                ease: 'easeInOut',
                            }}
                            style={{
                                opacity: 0.7,
                            }}
                        />
                    </motion.div>
                ))}
            </div>
        </div>
    )
}

export default LoadingShimmer
