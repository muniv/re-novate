import { IChatMessage, IChatResponse } from '@/interfaces/common/IChatMessage'
import { getPrompt } from '@/util/PromptUtils'
import { LLMTasks, LLMType } from '@/Constants'

export const fetchChatResponse = async (
    messages: IChatMessage[]
): Promise<IChatResponse> => {
    try {
        const serviceType = process.env.NEXT_PUBLIC_MAIN_API_SERVICE_TYPE
        const res = await fetch(`/api/${serviceType}/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                innovation: 'RN7MGKVRA8',
            },
            body: JSON.stringify({
                temperature: 0.2,
                messages,
            }),
        })

        if (!res.ok) {
            throw new Error('Failed to fetch chat response')
        }

        // JSON 응답 처리
        const data = await res.json()

        return {
            success: data['success'],
            data: data['data'], // 응답 데이터를 반환
        }
    } catch (error) {
        console.error('Error fetching chat response:', error)
        return {
            success: false,
            data: '',
            error: error instanceof Error ? error.message : 'Unknown error',
        }
    }
}

export const fetchSearchKeywords = async (
    question: string,
    llmType: LLMType = LLMType.openai
): Promise<IChatResponse> => {
    try {
        let prompt = getPrompt(LLMTasks.extractSearchKeywords, question)

        // 솔라인 경우, 키워드를 프롬프트 영어로 변환
        if (llmType === LLMType.solar) {
            const translateResult = await fetchTranslate(prompt)
            prompt = translateResult.data ?? ''
        }

        const res = await fetch(`/api/${llmType}/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                innovation: 'RN7MGKVRA8',
            },
            body: JSON.stringify({
                temperature: 0,
                max_tokens: 60,
                messages: [
                    {
                        role: 'system',
                        content: 'You are a helpful assistant.',
                    },
                    {
                        role: 'user',
                        content: prompt,
                    },
                ],
            }),
        })

        if (!res.ok) {
            throw new Error('Failed to fetch chat response')
        }

        // JSON 응답 처리
        const data = await res.json()

        return {
            success: data['success'],
            data: data['data'], // 응답 데이터를 반환
        }
    } catch (error) {
        console.error('Error fetching chat response:', error)
        return {
            success: false,
            data: '',
            error: error instanceof Error ? error.message : 'Unknown error',
        }
    }
}

export const fetchReportMarkdown = async (
    question: string,
    context: string,
    imageUrl?: string,
    tableContents?: string,
    llmType: LLMType = LLMType.openai
): Promise<IChatResponse> => {
    try {
        console.log("tableContents:"+tableContents)
        console.log("llmType:"+llmType)
        let prompt = getPrompt(
            LLMTasks.generateReport,
            question,
            context,
            undefined,
            imageUrl,
            tableContents,
        )

        if (llmType === LLMType.solar) {
            const translateResult = await fetchTranslate(prompt)
            prompt = translateResult.data ?? ''
        }

        const res = await fetch(`/api/${llmType}/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                innovation: 'RN7MGKVRA8',
            },
            body: JSON.stringify({
                temperature: 0,
                messages: [
                    {
                        role: 'system',
                        content: 'You are a helpful assistant.',
                    },
                    {
                        role: 'user',
                        content: prompt,
                    },
                ],
            }),
        })

        if (!res.ok) {
            throw new Error('Failed to fetch chat response')
        }

        // JSON 응답 처리
        const data = await res.json()

        return {
            success: data['success'],
            data: data['data'], // 응답 데이터를 반환
        }
    } catch (error) {
        console.error('Error fetching chat response:', error)
        return {
            success: false,
            data: '',
            error: error instanceof Error ? error.message : 'Unknown error',
        }
    }
}

export const fetchTranslate = async (
    question: string,
    llmType: LLMType = LLMType.solar
): Promise<IChatResponse> => {
    try {
        const res = await fetch(`/api/${llmType}/translate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                innovation: 'RN7MGKVRA8',
            },
            body: JSON.stringify({
                temperature: 0,
                messages: [
                    {
                        role: 'system',
                        content: 'You are a helpful assistant.',
                    },
                    {
                        role: 'user',
                        content: question,
                    },
                ],
            }),
        })

        if (!res.ok) {
            throw new Error('Failed to fetch chat response')
        }

        // JSON 응답 처리
        const data = await res.json()

        return {
            success: data['success'],
            data: data['data'], // 응답 데이터를 반환
        }
    } catch (error) {
        console.error('Error fetching chat response:', error)
        return {
            success: false,
            data: '',
            error: error instanceof Error ? error.message : 'Unknown error',
        }
    }
}

export const fetchKeyword = async (
    question: string
): Promise<IChatResponse> => {
    try {
        const prompt = getPrompt(LLMTasks.recommendKeywords, question)
        const serviceType = process.env.NEXT_PUBLIC_MAIN_API_SERVICE_TYPE
        const res = await fetch(`/api/${serviceType}/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                innovation: 'RN7MGKVRA8',
            },
            body: JSON.stringify({
                temperature: 0,
                messages: [
                    {
                        role: 'system',
                        content: 'You are a helpful assistant.',
                    },
                    {
                        role: 'user',
                        content: prompt,
                    },
                ],
            }),
        })

        if (!res.ok) {
            throw new Error('Failed to fetch chat response')
        }

        // JSON 응답 처리
        const data = await res.json()

        return {
            success: data['success'],
            data: data['data'], // 응답 데이터를 반환
        }
    } catch (error) {
        console.error('Error fetching chat response:', error)
        return {
            success: false,
            data: '',
            error: error instanceof Error ? error.message : 'Unknown error',
        }
    }
}

export const fetchKeywordForDalle = async (
    question: string
): Promise<IChatResponse> => {
    try {
        const prompt = getPrompt(LLMTasks.recommendKeywordsForImage, question)
        const serviceType = process.env.NEXT_PUBLIC_MAIN_API_SERVICE_TYPE
        const res = await fetch(`/api/${serviceType}/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                innovation: 'RN7MGKVRA8',
            },
            body: JSON.stringify({
                temperature: 0,
                messages: [
                    {
                        role: 'system',
                        content: 'You are a helpful assistant.',
                    },
                    {
                        role: 'user',
                        content: prompt,
                    },
                ],
            }),
        })

        if (!res.ok) {
            throw new Error('Failed to fetch chat response')
        }

        // JSON 응답 처리
        const data = await res.json()

        return {
            success: data['success'],
            data: data['data'], // 응답 데이터를 반환
        }
    } catch (error) {
        console.error('Error fetching chat response:', error)
        return {
            success: false,
            data: '',
            error: error instanceof Error ? error.message : 'Unknown error',
        }
    }
}

export const fetchRearrangedQuestion = async (
    question: string
): Promise<IChatResponse> => {
    try {
        const prompt = getPrompt(LLMTasks.reArrangeQuestion, question)
        const serviceType = process.env.NEXT_PUBLIC_MAIN_API_SERVICE_TYPE
        const res = await fetch(`/api/${serviceType}/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                innovation: 'RN7MGKVRA8',
            },
            body: JSON.stringify({
                temperature: 0,
                messages: [
                    {
                        role: 'system',
                        content: 'You are a helpful assistant.',
                    },
                    {
                        role: 'user',
                        content: prompt,
                    },
                ],
            }),
        })

        if (!res.ok) {
            throw new Error('Failed to fetch chat response')
        }

        // JSON 응답 처리
        const data = await res.json()

        return {
            success: data['success'],
            data: data['data'], // 응답 데이터를 반환
        }
    } catch (error) {
        console.error('Error fetching chat response:', error)
        return {
            success: false,
            data: '',
            error: error instanceof Error ? error.message : 'Unknown error',
        }
    }
}

export const fetchRearrangedContexts = async (
    question: string,
    context: string
): Promise<IChatResponse> => {
    try {
        const prompt = getPrompt(LLMTasks.reArrangeContext, question, context)
        const serviceType = process.env.NEXT_PUBLIC_MAIN_API_SERVICE_TYPE
        const res = await fetch(`/api/${serviceType}/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                innovation: 'RN7MGKVRA8',
            },
            body: JSON.stringify({
                temperature: 0,
                messages: [
                    {
                        role: 'system',
                        content: 'You are a helpful assistant.',
                    },
                    {
                        role: 'user',
                        content: prompt,
                    },
                ],
            }),
        })

        if (!res.ok) {
            throw new Error('Failed to fetch chat response')
        }

        // JSON 응답 처리
        const data = await res.json()

        return {
            success: data['success'],
            data: data['data'], // 응답 데이터를 반환
        }
    } catch (error) {
        console.error('Error fetching chat response:', error)
        return {
            success: false,
            data: '',
            error: error instanceof Error ? error.message : 'Unknown error',
        }
    }
}

export const fetchDallEResponse = async (
    message: string, // messages를 받습니다.
    llmType: LLMType = LLMType.openai
): Promise<IChatResponse> => {
    try {
        // messages 배열에서 prompt로 사용할 텍스트 추출
        let prompt = message || 'data, report'
        //const prompt = message
        //    ? `A modern and futuristic artwork incorporating the following keywords: ${message}. The design should visually reflect these concepts, using digital lines, data patterns, and other relevant elements. For example, if the keyword is related to finance, incorporate subtle financial charts or stock graphs into the background. The color palette should align with the theme of the keywords, using sleek and professional tones like blues, greys, or other fitting colors. No text or book structure should be present, just the visual elements completely filling the canvas.`
        //    : 'A modern and futuristic artwork incorporating the following keywords: data, report. The design should visually reflect these concepts, using digital lines, data patterns, and other relevant elements. For example, if the keyword is related to finance, incorporate subtle financial charts or stock graphs into the background. The color palette should align with the theme of the keywords, using sleek and professional tones like blues, greys, or other fitting colors. No text or book structure should be present, just the visual elements completely filling the canvas.'
        // 로그 추가
        console.log('DALL·E Keywords:', message)
        console.log('DALL·E prompt:', prompt)

        // 달리 생성시 한 -> 영어 번역 추가
        const translateResult = await fetchTranslate(prompt)
        prompt = translateResult.data

        const res = await fetch(`/api/openai/dalle`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                innovation: 'RN7MGKVRA8',
            },
            body: JSON.stringify({
                model: 'dall-e-3', // DALL·E 3 모델 사용
                prompt, // DALL·E로 전송할 프롬프트
                n: 1, // 이미지 생성 개수
                size: '512x512', // 이미지 크기
            }),
        })

        if (!res.ok) {
            const errorDetails = await res.text()
            console.error(`Failed to fetch DALL·E response: ${errorDetails}`)
            throw new Error(`Failed to fetch DALL·E response: ${res.status}`)
        }

        // JSON 응답 처리
        const data = await res.json()

        return {
            success: data['success'],
            data: data['data'], // 이미지 URL을 반환
        }
    } catch (error) {
        console.error('Error fetching DALL·E response:', error)
        return {
            success: false,
            data: '',
            error: error instanceof Error ? error.message : 'Unknown error',
        }
    }
}

export const fetchTranslateKeywordsToEnglish = async (
    // 이름 변경
    keywords: string
): Promise<IChatResponse> => {
    try {
        const prompt = `형태 유지 그대로 하고 영어로 번역. 영어로 번역한 결과만 나와야함\n예시: 고양이, 얼음, 여름 -> cat, ice, summer\n${keywords} ->`
        const serviceType = process.env.NEXT_PUBLIC_MAIN_API_SERVICE_TYPE
        const res = await fetch(`/api/${serviceType}/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                innovation: 'RN7MGKVRA8',
            },
            body: JSON.stringify({
                temperature: 0,
                messages: [
                    {
                        role: 'system',
                        content: 'You are a helpful assistant.',
                    },
                    {
                        role: 'user',
                        content: prompt,
                    },
                ],
            }),
        })

        if (!res.ok) {
            throw new Error('Failed to fetch translation response')
        }

        // JSON 응답 처리
        const data = await res.json()

        return {
            success: data['success'],
            data: data['data'], // 번역된 키워드를 반환
        }
    } catch (error) {
        console.error('Error fetching translation response:', error)
        return {
            success: false,
            data: '',
            error: error instanceof Error ? error.message : 'Unknown error',
        }
    }
}

export const fetchStructuredResponse = async (
    question: string
): Promise<IChatResponse> => {
    try {
        const systemPrompt = {
            role: "system",
            content: "You are a report generator that provides only the titles of each section in a structured report in Korean. Respond to user prompts by generating a title for each report section: Title, Introduction, Body1, Body2, Body3, Body4, Body5, and Conclusion. Return only the section titles without any labels, in a way that flows naturally."
        }
        const userPrompt = {
            role: "user",
            content: `주제 '${question}'에 대한 보고서 개요를 작성해 주세요. 각 섹션의 제목만 제공하며, 다음 구조를 따르세요:\n\n- **제목**: 보고서의 메인 제목\n- **소개**: 소개 섹션의 제목\n- **본론1**부터 **본론5**: 각 본론 섹션의 제목\n- **결론**: 결론 섹션의 제목\n\n각 제목은 간결하고 주제 '${question}'와 관련된 내용이어야 하며, "본론1", "본론2" 등의 라벨 없이 제목만 반환해 주세요.`
        };
        
        const jsonSchema = {
            name: "structured_response",
            strict: true,
            schema: {
              type: "object",
              properties: {
                tableContents: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                        title: {
                        type: "string"
                      },
                      introduction: {
                        type: "string"
                      },
                      body1: {
                        type: "string"
                      },
                      body2: {
                        type: "string"
                      },
                      body3: {
                        type: "string"
                      },
                      body4: {
                        type: "string"
                      },
                      body5: {
                        type: "string"
                      },
                      conclusion: {
                        type: "string"
                      },
                    },
                    required: ["title", "introduction", "body1", "body2", "body3", "body4", "body5", "conclusion"],
                    additionalProperties: false
                  }
                },
              },
              required: ["tableContents"],
              additionalProperties: false
            }
        }; 
        const res = await fetch(`/api/openai/structuredChat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                innovation: 'RN7MGKVRA8',
            },
            body: JSON.stringify({
                temperature: 0.2,
                messages: [
                    systemPrompt,
                    userPrompt,
                ],
                response_format: {
                    type: "json_schema",
                    json_schema: jsonSchema,
                },
            }),
        })

        if (!res.ok) {
            throw new Error('Failed to fetch structured chat response')
        }

        // JSON 응답 처리
        const data = await res.json()

        return {
            success: data['success'],
            data: data['data'], // 스키마에 맞는 응답 데이터를 반환
        }
    } catch (error) {
        console.error('Error fetching structured chat response:', error)
        return {
            success: false,
            data: '',
            error: error instanceof Error ? error.message : 'Unknown error',
        }
    }
}
