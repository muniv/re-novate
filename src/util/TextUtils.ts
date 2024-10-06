// remarkSplitSentences.ts
import { Plugin } from 'unified'
import { visit } from 'unist-util-visit'
import { Literal, Parent } from 'unist'
import { IOCRItem, IOCRResponse } from '@/interfaces/draft/IOCRResults'

export const removeHtmlTags = (inputString: string): string => {
    return inputString.replace(/<\/?[^>]+(>|$)/g, '')
}

const remarkSplitSentences: Plugin = () => {
    return (tree) => {
        visit(tree, 'text', (node: Literal, index, parent: Parent) => {
            if (!parent || typeof node.value !== 'string') return

            // 문장 분할을 위한 정규식 수정
            const sentences = node.value.split(/(?<=\.)|\n/)

            if (sentences && sentences.length > 1) {
                const sentenceNodes = sentences.map((sentence) => ({
                    type: 'text',
                    value: sentence,
                }))

                parent.children.splice(index!, 1, ...sentenceNodes)
            }
        })
    }
}

export default remarkSplitSentences

export const parseOCRHtml = (ocrResponse: IOCRResponse): string => {
    if (!ocrResponse.success) {
        throw new Error('OCR response unsuccessful')
    }

    const { elements } = ocrResponse.data

    // Concatenate the html from all the elements
    const combinedHtml = elements
        .map((item: IOCRItem) => item.content.html)
        .join('\n') // Joins the HTML content from all elements

    return combinedHtml
}
