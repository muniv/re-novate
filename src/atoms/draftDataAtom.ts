// recoil/fileState.js
import { atom } from 'recoil'
import { IDraftData } from '@/interfaces/draft/IDraftData'

export const draftDataAtom = atom<IDraftData>({
    key: 'fileState',
    default: {
        question: '',
        keywords: '',
        searchQueryCount: 3,
        urls: [],
        urlContents: [],
        docFiles: [],
        docContents: [],
        naverSearchItems: [],
        useDalle: false,
    },
})
