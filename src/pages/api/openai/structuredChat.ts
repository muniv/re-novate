import { NextApiRequest, NextApiResponse } from 'next';
import { IChatResponse } from '@/interfaces/common/IChatMessage';
import { message } from 'antd';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Only POST requests are allowed' });
    }

    try {
        const { model, messages } = req.body;
        const apiKey = process.env.OPENAI_API_KEY;

        if (!apiKey) {
            return res.status(500).json({ message: 'API Key is missing' });
        }

        // 헤더 체크
        const innovationHeader = req.headers['innovation'];
        if (innovationHeader !== 'RN7MGKVRA8') {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        // JSON Schema 정의
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
        const systemPrompt = {
            role: "system",
            content: "You are a report generator that provides only the titles of each section in a structured report in Korean. Respond to user prompts by generating a title for each report section: Title, Introduction, Body1, Body2, Body3, Body4, Body5, and Conclusion. Return only the section titles without any labels, in a way that flows naturally."
        }
        
        const subject = "Z세대 트렌드"; // 원하는 주제로 변경 가능
        const userPrompt = {
            role: "user",
            content: `주제 '${subject}'에 대한 보고서 개요를 작성해 주세요. 각 섹션의 제목만 제공하며, 다음 구조를 따르세요:\n\n- **제목**: 보고서의 메인 제목\n- **소개**: 소개 섹션의 제목\n- **본론1**부터 **본론5**: 각 본론 섹션의 제목\n- **결론**: 결론 섹션의 제목\n\n각 제목은 간결하고 주제 '${subject}'와 관련된 내용이어야 하며, "본론1", "본론2" 등의 라벨 없이 제목만 반환해 주세요.`
        };
        


        // OpenAI API 호출
        const apiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${apiKey}`, // .env에서 읽은 API Key 사용
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: model || 'gpt-4o-mini', // default model
                messages: messages || [
                    systemPrompt,
                    userPrompt,
                ],
                response_format: {
                    type: "json_schema",
                    json_schema: jsonSchema,
                },
            }),
        });

        if (!apiResponse.ok) {
            return res.status(apiResponse.status).json({
                message: 'Failed to fetch from OpenAI API',
            });
        }

        // JSON 응답 처리
        const data = await apiResponse.json();

        // 구조화된 응답에서 필요한 데이터 추출
        const content = data.choices?.[0]?.message?.content || 'No structured response';

        const response: IChatResponse = {
            success: true,
            data: content, // message.content 값
        };

        // JSON 응답을 클라이언트에 전달
        res.status(200).json(response);
    } catch (error) {
        console.error('Error in response: ', error);
        const response: IChatResponse = {
            success: false,
            data: '',
            error: error instanceof Error ? error.message : 'Unknown error',
        };
        res.status(500).json(response);
    }
}