// 폰트 파일을 가져와서 Base64로 변환하는 함수
const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
    let binary = ''
    const bytes = new Uint8Array(buffer)
    const len = bytes.byteLength
    const chunkSize = 0x8000 // 32KB 청크

    for (let i = 0; i < len; i += chunkSize) {
        const chunk = bytes.subarray(i, Math.min(i + chunkSize, len))
        binary += String.fromCharCode.apply(null, chunk as any)
    }

    return btoa(binary)
}

export const loadFont = async (url: string): Promise<string> => {
    const response = await fetch(url)
    const arrayBuffer = await response.arrayBuffer()
    const base64String = arrayBufferToBase64(arrayBuffer)
    return base64String
}
