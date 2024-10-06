import { ReactNode } from 'react'

interface Props {
    icon: ReactNode
    disabled?: boolean
    loading?: boolean
    color?: 'transparent' | 'outline' | 'primary' | 'shadow'
    style?: string
    size?: string

    [key: string]: any
}

const ImageButton = ({
    icon,
    disabled = false,
    loading = false,
    style = '',
    size = '',
    color = 'transparent',
    ...rest
}: Props) => {
    const getColor = (color: string) => {
        switch (color) {
            case 'primary':
                return `rounded-btn ${disabled ? 'bg-tertiary-base ' : 'bg-primary '} `

            case 'transparent':
                return 'bg-transparent'

            case 'shadow':
                return `bg-white text-desc2 shadow-[0px_1px_2px_#00000029] flex-none ${disabled ? 'text-typo-250' : 'text-typo-500'}`

            case 'outline':
                return 'border border-border-base rounded-btn'

            default:
                return 'bg-transparent'
        }
    }

    return (
        <button
            className={`img-button inline-flex aspect-square items-center justify-center ${getColor(color)} ${size} ${style}`}
            disabled={disabled}
            {...rest}
        >
            {icon}
        </button>
    )
}

export default ImageButton
