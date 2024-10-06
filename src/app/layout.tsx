'use client'

import './globals.css'
import { ConfigProvider } from 'antd'
import { RecoilRoot } from 'recoil'

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en">
            <head>
                <link
                    href="//spoqa.github.io/spoqa-han-sans/css/SpoqaHanSansNeo.css"
                    rel="stylesheet"
                    type="text/css"
                />
                <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
                <title>Re:novation</title>
                <link rel="icon" href="/images/ic_logo.png" type="image/png" />
                <meta
                    name="viewport"
                    content="width=device-width,initial-scale=1.0,maximum-scale=1.0,minimum-scale=1.0,user-scalable=no,viewport-fit=cover"
                />
            </head>

            <body className="flex flex-col flex-1 ">
                <RecoilRoot>
                    <ConfigProvider
                        theme={{
                            token: {
                                colorPrimary: '#6D28D9', // 원하는 primary color
                            },
                        }}
                    >
                        {children}
                    </ConfigProvider>
                </RecoilRoot>
            </body>
        </html>
    )
}
