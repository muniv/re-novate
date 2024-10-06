import React, { useEffect } from 'react'
import OcrContentItemComponent from './OcrContentItemComponent'

interface Props {
    files: File[]
    ocrContents: string[]
    selectedItems: Set<number>
    onSelectionChange: (index: number) => void
}

const OcrContentItemList: React.FC<Props> = ({
    files,
    ocrContents,
    selectedItems,
    onSelectionChange,
}) => {
    const getContent = (index: number) => {
        if (ocrContents === undefined || ocrContents.length < index) {
            return ''
        }
        return ocrContents[index]
    }

    useEffect(() => {
        console.log(`OCR Contents => ${ocrContents}`)
    }, [ocrContents])

    return (
        <div className="w-full flex flex-col">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {files.map((file, index) => (
                    <OcrContentItemComponent
                        key={index}
                        index={index}
                        content={getContent(index)}
                        file={file}
                        isSelected={selectedItems.has(index)}
                        onToggleSelect={(index) => onSelectionChange(index)}
                    />
                ))}
            </div>
        </div>
    )
}

export default OcrContentItemList
