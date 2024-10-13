import { atom } from 'recoil'
import { ISettings } from '@/interfaces/settings/ISettings'
import { LLMType } from '@/Constants'

export const settingsAtom = atom<ISettings>({
    key: 'settingsAtom',
    default: {
        selectedLLM: LLMType.openai,
    },
})
