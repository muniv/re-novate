'use client'

import {
    MessageSquare,
    Settings,
    LayoutDashboard,
    Code,
    Menu,
    Home,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { appRoutes } from '@/Constants'
import { Tooltip } from 'antd'

export const HorizontalNavbar = () => {
    const router = useRouter()

    const onHomeButtonClicked = () => {
        router.push(appRoutes.index)
    }

    return (
        <div className="flex h-screen bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 text-white">
            {/* Left Navbar */}
            <nav className="w-16 bg-[#2D2D2D] flex flex-col items-center py-4 space-y-4">
                <Tooltip title={'홈으로 가기'}>
                    <button
                        onClick={onHomeButtonClicked}
                        className="bg-transparent hover:bg-purple-600 text-white p-2 rounded-full transition duration-200 ease-in-out"
                    >
                        <Home className="h-6 w-6" />
                    </button>
                </Tooltip>
                {/*<button className="bg-transparent hover:bg-purple-600 text-white p-2 rounded-full transition duration-200 ease-in-out">*/}
                {/*    <MessageSquare className="h-6 w-6" />*/}
                {/*</button>*/}
                {/*<button className="bg-transparent hover:bg-purple-600 text-white p-2 rounded-full transition duration-200 ease-in-out">*/}
                {/*    <LayoutDashboard className="h-6 w-6" />*/}
                {/*</button>*/}
                {/*<button className="bg-transparent hover:bg-purple-600 text-white p-2 rounded-full transition duration-200 ease-in-out">*/}
                {/*    <Code className="h-6 w-6" />*/}
                {/*</button>*/}
                <div className="flex-grow" />
                <Tooltip title={'아직 지원하지 않는 기능입니다.'}>
                    <button className="bg-transparent hover:bg-purple-600 text-white p-2 rounded-full transition duration-200 ease-in-out">
                        <Settings className="h-6 w-6" />
                    </button>
                </Tooltip>
            </nav>
        </div>
    )
}
