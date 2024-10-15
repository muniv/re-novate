import { LLMTasks } from '@/Constants'

export const getPrompt = (
    task: LLMTasks,
    question: string,
    context?: string,
    selectedContextPiecce?: string, //컨텍스트 내용 중 선택된 부분
    imageUrl?: string,
    tableContents?: string
) => {
    // tableContents를 JSON 객체로 변환
    let parsedTableContents = null

    if (tableContents) {
        console.log('Original tableContents:', tableContents)

        // `tableContents`가 객체인지 문자열인지 확인
        if (typeof tableContents === 'string') {
            try {
                parsedTableContents = JSON.parse(tableContents)
                console.log('Parsed tableContents:', parsedTableContents)
            } catch (error) {
                console.error('Invalid JSON format for tableContents:', error)
                parsedTableContents = null // 예외 발생 시 null로 설정
            }
        } else {
            // 이미 JSON 객체인 경우
            parsedTableContents = tableContents
            console.log('tableContents is already parsed:', parsedTableContents)
        }
    }

    let prompt = ''

    // 일반 질문
    if (task === LLMTasks.qa) {
        prompt =
            '### Instruct: \n' +
            '다음 물음에 맞는 적절한 답변을 생성해주세요.\n' +
            '\n' +
            '### Question: \n' +
            `${question}\n` +
            '\n' +
            '### Output: \n'
    }

    if (task == LLMTasks.extractSearchKeywords) {
        prompt =
            '### Instruct: \n' +
            '다음 질문에 적절한 인터넷 검색용 키워드를 2개~3개 정도 띄어쓰기 단위로 생성해주세요. 반드시 명사 위주로 추출해주세요.\n' +
            '\n' +
            '### 답변 예시:\n' +
            '키워드1 키워드2 키워드3\n' +
            '\n' +
            '### 답변 예시:\n' +
            '오리 농장 사육 \n' +
            '\n' +
            '### Question: \n' +
            `${question}\n` +
            '\n' +
            '### Output: \n'
    }

    // 보고서 생성
    if (task == LLMTasks.generateReport) {
        prompt =
            '### 지시사항 (Instruct): \n' +
            '아래의 질문과 참고자료를 바탕으로, 기승전결이 있는 보고서를 작성해주세요. 보고서는 **서론**, 번호가 매겨진 **본론** (1.,1-1, 1-2, 1-3,..., 2.,2-1,2-2, ..., 3., 3-1,3-2,... 등), 그리고 **결론**으로 구성되며, 각 섹션은 적절한 마크다운 헤딩(`#`, `##`, `###`)을 사용하여 구분해주세요. 충분히 길게 작성해주세요. 내용은 바로 보고가 가능하도록 단락별로 3줄 이내로 깔끔하고 명확하게 작성해주세요.\n' +
            '\n' +
            '### 질문 (Question): \n' +
            `${question}\n` +
            '\n' +
            '### 참고자료 (Context):\n' +
            `${context}\n\n`

        // tableContents가 있을 경우 각 섹션의 내용을 명확히 제시
        if (parsedTableContents) {
            prompt += '### 섹션 안내 (Sections Guide):\n'
            prompt += `- 제목: ${parsedTableContents.title}\n`
            prompt += `- 서론: ${parsedTableContents.introduction}\n`

            if (parsedTableContents.body1)
                prompt += `- 본론1: ${parsedTableContents.body1}\n`
            if (parsedTableContents.body2)
                prompt += `- 본론2: ${parsedTableContents.body2}\n`
            if (parsedTableContents.body3)
                prompt += `- 본론3: ${parsedTableContents.body3}\n`

            prompt += `- 결론: ${parsedTableContents.conclusion}\n\n`
        }

        // 유저가 이미지 url을 줬을 경우 프롬프트에 추가
        if (imageUrl) {
            prompt +=
                `### 본문에 첨부될 이미지 링크(제목 바로 아래에 위치해주세요.): \n` +
                `${imageUrl}\n\n`
        }

        prompt += '### 출력 (Output): \n'
    }

    // 보고서 수정
    if (task == LLMTasks.fixReport) {
        prompt =
            '### Instruct: \n' +
            '아래의 질문과 참고자료에서 유저의 요청에 따라 마크다운을 수정하여 다시 보고서를 작성해주세요.\n' +
            '\n' +
            '### 유저 요청: \n' +
            `${question}\n` +
            '\n' +
            '### 원문: \n' +
            `${context}\n` +
            '\n'

        // 유저가 컨텍스트 중 선택했을 경우 프롬프트에 추가
        if (selectedContextPiecce) {
            prompt +=
                '### 원문 중 수정을 요청한 부분: \n' +
                `${selectedContextPiecce}\n` +
                '\n'
        }

        prompt += '### Output: \n'
    }

    // 키워드 추천
    if (task === LLMTasks.recommendKeywords) {
        prompt =
            '### Instruct: \n' +
            '아래의 질문을 효과적으로 답변하기 위한 키워드를 추천해주세요. 키워드는 콤마단위로 해주고, 최대 3개 추천해주세요.\n' +
            '\n' +
            '### 질문: \n' +
            `${question}\n` +
            '\n' +
            '### 답변: \n'
    }

    // 이미지용 키워드 추천
    if (task === LLMTasks.recommendKeywordsForImage) {
        prompt =
            '### Instruct: \n' +
            '아래의 질문에 대한 이미지를 생성하기 위한 Dalle용 프롬프트를 추천해주세요. 40토큰 이내로 설명 없이 바로 답변을 생성해주세요.\n' +
            '\n' +
            '### 질문: \n' +
            `${question}\n` +
            '\n' +
            '### 답변: \n'
    }

    // 질문 다듬기
    if (task === LLMTasks.reArrangeQuestion) {
        prompt =
            '### Instruct: \n' +
            '아래의 질문에 대한 답을 효과적으로 답변하기 위해, 질문을 다듬어주세요.\n' +
            '\n' +
            '### 현재 질문: \n' +
            `${question}\n` +
            '\n' +
            '### 변경할 질문: \n'
    }

    //질문과 관련있는 컨텍스트만 남기기
    if (task === LLMTasks.reArrangeContext) {
        prompt =
            '### Instruct: \n' +
            '아래의 질문과 관련이 있는 Context에 대한 데이터만 남겨서 형태를 유지하여 Context를 재작성해주세요.\n' +
            '\n' +
            '### 질문: \n' +
            `${question}\n` +
            '\n' +
            '### Context: \n' +
            `${context}\n` +
            '\n' +
            '### 새로운 Context: \n'
    }

    return prompt
}
