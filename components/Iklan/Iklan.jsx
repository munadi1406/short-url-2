'use client'
import React from 'react'

function AdSlot({ html }) {
    const ref = React.useRef(null)

    React.useEffect(() => {
        if (!ref.current || !html) return

        // clear dulu
        ref.current.innerHTML = ''

        const wrapper = document.createRange().createContextualFragment(html)
        ref.current.appendChild(wrapper)
    }, [html])

    return <div ref={ref} />
}

export default function Iklan({ ads }) {
    if (!ads) return null

    return (
        <div>
            {/* Header */}
            {ads.header && (
                <div className="w-full my-2">
                    <AdSlot html={ads.header} />
                </div>
            )}

            {/* Sidebar */}
            {ads.sidebar && (
                <div className="w-full my-2">
                    <AdSlot html={ads.sidebar} />
                </div>
            )}

            {/* In-Content */}
            {ads.inContent && (
                <div className="w-full my-2">
                    <AdSlot html={ads.inContent} />
                </div>
            )}

            {/* Footer */}
            {ads.footer && (
                <div className="w-full my-2">
                    <AdSlot html={ads.footer} />
                </div>
            )}
        </div>
    )
}