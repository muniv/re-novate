import React, { useEffect } from 'react'
import UrlContentItemComponent from './UrlContentItemComponent'

interface Props {
    contents: string[]
    urls: string[]
    selectedItems: Set<number>
    onSelectionChange: (index: number) => void
}

const UrlContentItemList: React.FC<Props> = ({
    urls,
    contents,
    selectedItems,
    onSelectionChange,
}) => {
    const getContent = (index: number) => {
        if (contents === undefined || contents.length < index) {
            return ''
        }
        console.log(`contents => ${contents}`)
        return contents[index]
    }

    useEffect(() => {
        console.log(`contents => ${contents}`)
    }, [contents])

    return (
        <div className="w-full flex flex-col">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {urls.map((content, index) => (
                    <UrlContentItemComponent
                        key={index}
                        index={index}
                        content={getContent(index)}
                        url={urls[index]}
                        isSelected={selectedItems.has(index)}
                        onToggleSelect={(index) => onSelectionChange(index)}
                    />
                ))}
            </div>
        </div>
    )
}

export default UrlContentItemList
