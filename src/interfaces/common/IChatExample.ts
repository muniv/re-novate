import { ChatExampleType } from '@/Constants'
import React from 'react'

export interface IChatExample {
    title?: string
    description?: string
    type?: ChatExampleType
    icon?: React.ReactNode
}
