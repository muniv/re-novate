import React, { ChangeEvent } from 'react'
import { Input, Button } from 'antd'

interface Props {
    urls: string[]
    setUrls: React.Dispatch<React.SetStateAction<string[]>>
}

const UrlInput: React.FC<Props> = ({ urls, setUrls }) => {
    const handleAdd = () => {
        setUrls([...urls, '']) // Add a new empty input
    }

    const handleRemove = (index: number) => {
        const newUrls = urls.filter((_, idx) => idx !== index) // Remove input at the given index
        setUrls(newUrls)
    }

    const handleChange =
        (index: number) => (e: ChangeEvent<HTMLInputElement>) => {
            const value = e.target.value

            setUrls((prevUrls) => {
                const updatedUrls = [...prevUrls] // Create a copy of the array
                updatedUrls[index] = value // Update the specific index
                return updatedUrls // Return the updated array
            })
        }

    return (
        <div className="flex flex-col w-full items-start gap-[8px]">
            {[0, 1, 2].map((index) => {
                return (
                    <Input
                        key={index}
                        type={'url'}
                        name={`${index}`}
                        value={urls[index]}
                        className={'flex-1'}
                        onChange={handleChange(index)}
                        placeholder={'참고할 url을 입력해주세요.'}
                    />
                )
            })}
        </div>
    )
}

export default UrlInput
