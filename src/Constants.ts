export enum ChatExampleType {
    text,
    report,
    email,
}

export enum LLMType {
    openai = 'openai',
    solar = 'solar',
}

export enum LLMTasks {
    qa, //일반 질문 답변
    extractSearchKeywords, //검색 키워드 추출
    generateReport, //보고서 작성
    fixReport, //보고서 수정
    recommendKeywords, //키워드 추천
    recommendKeywordsForImage, //키워드 추천
    reArrangeQuestion, //질문 다듬기
    reArrangeContext, //질문과 관련있는 컨텍스트만 남기기
    generateOutlineText, //키워드 추천
    email,
}

export const appRoutes = {
    index: '/',
    generate: '/generate',
    confirm: '/confirm',
}
