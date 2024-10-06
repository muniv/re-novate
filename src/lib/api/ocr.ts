import { parseOCRHtml } from '@/util/TextUtils'

export const fetchOCRResult = async (
    file: File
): Promise<{ success: boolean; data: string; error?: string }> => {
    try {
        // Prepare the FormData to send the file
        const formData = new FormData()
        formData.append('document', file)

        // Call the OCR API
        const res = await fetch('/api/solar/ocr', {
            method: 'POST',
            body: formData, // Send the file as form data
            headers: {
                innovation: 'RN7MGKVRA8',
            },
        })

        if (!res.ok) {
            throw new Error('Failed to fetch OCR response')
        }

        // Process the JSON response
        const data = await res.json()

        if (!data.success) {
            return {
                success: false,
                data: '',
                error: 'OCR processing failed',
            }
        }

        const combinedHtml = parseOCRHtml(data)

        return {
            success: true,
            data: combinedHtml, // Return the combined HTML string
        }
    } catch (error) {
        console.error('Error fetching OCR response:', error)
        return {
            success: false,
            data: '',
            error: error instanceof Error ? error.message : 'Unknown error',
        }
    }
}
