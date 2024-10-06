import React from 'react'

interface GradientTextProps {
    fontSize?: string
    bold?: boolean
    children?: React.ReactNode
}

const GradientText: React.FC<GradientTextProps> = ({
    fontSize = '16px',
    bold,
    children,
}) => {
    return (
        <span
            className={`bg-gradient-to-r from-purple-950 via-purple-500 to-pink-300 text-transparent bg-clip-text ${bold ? 'font-bold' : ''}`}
            style={{ fontSize }}
        >
            {children}
        </span>
    )
}

export default GradientText
