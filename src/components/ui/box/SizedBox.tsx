import React from 'react';

interface SizedBoxProps {
    width?: number | string;
    height?: number | string;
    backgroundColor?: string;
    children?: React.ReactNode; // 자식 요소를 받을 수 있게 설정
}

const SizedBox: React.FC<SizedBoxProps> = ({ width = '0px', height = '0px', backgroundColor = 'transparent', children }) => {
    return (
        <div
            style={{
                width: width,
                height: height,
                backgroundColor: backgroundColor,
            }}
        >
            {children}
        </div>
    );
};

export default SizedBox;
