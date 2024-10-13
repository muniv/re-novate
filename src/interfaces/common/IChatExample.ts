import { ChatExampleType, LLMType } from '@/Constants'
import React from 'react'

export interface IChatExample {
    title?: string
    description?: string
    type?: ChatExampleType
    icon?: React.ReactNode
    selectedLLM?: LLMType
}
