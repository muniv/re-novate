// /pages/api/ocr.ts

import { NextApiRequest, NextApiResponse } from 'next'
import formidable, { File as FormidableFile } from 'formidable'
import FormData from 'form-data'
import fs from 'fs'
import axios from 'axios'

export const config = {
    api: {
        bodyParser: false, // Disables Next.js's default body parser to handle file uploads
    },
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== 'POST') {
        return res
            .status(405)
            .json({ message: 'Only POST requests are allowed' })
    }

    // Parse the incoming form data to get the file
    const form = formidable({ multiples: false })
    form.parse(req, async (err, fields, files) => {
        if (err) {
            console.error('Error parsing form: ', err)
            return res.status(500).json({ message: 'Error parsing form data' })
        }

        try {
            const apiKey = process.env.UPSTAGE_API_KEY

            if (!apiKey) {
                return res.status(500).json({ message: 'API Key is missing' })
            }

            // 헤더 체크
            const innovationHeader = req.headers['innovation']
            if (innovationHeader !== 'RN7MGKVRA8') {
                return res.status(401).json({ message: 'Unauthorized' })
            }

            // Ensure files.document exists and is of correct type
            const fileField = files.document
            if (!fileField) {
                return res.status(400).json({ message: 'No file provided' })
            }

            // Handle case where files.document can be an array or a single file
            const file: FormidableFile = Array.isArray(fileField)
                ? fileField[0]
                : fileField

            if (!file) {
                return res.status(400).json({ message: 'No file provided' })
            }

            // Create a FormData object and append the file
            const formData = new FormData()
            const filename = file.originalFilename || 'unknown_filename'

            formData.append(
                'document',
                fs.createReadStream(file.filepath),
                filename
            )

            // Make the POST request to the Upstage OCR API using axios
            const apiResponse = await axios.post(
                'https://api.upstage.ai/v1/document-ai/document-parse',
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${apiKey}`,
                        ...formData.getHeaders(),
                    },
                }
            )

            // Return the data to the client
            res.status(200).json({
                success: true,
                data: apiResponse.data,
            })
        } catch (error) {
            console.error('Error in response: ', error)

            if (axios.isAxiosError(error) && error.response) {
                // Axios error with response
                res.status(error.response.status).json({
                    success: false,
                    data: '',
                    error: error.response.data || error.message,
                })
            } else {
                res.status(500).json({
                    success: false,
                    data: '',
                    error:
                        error instanceof Error
                            ? error.message
                            : 'Unknown error',
                })
            }
        } finally {
            // Clean up the temporary file
            const fileField = files.document
            const file = Array.isArray(fileField) ? fileField[0] : fileField
            if (file && file.filepath) {
                fs.unlink(file.filepath, (err) => {
                    if (err)
                        console.error('Failed to delete temporary file:', err)
                })
            }
        }
    })
}
