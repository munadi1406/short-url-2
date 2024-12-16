'use client'
import Script from 'next/script'
import React from 'react'

export default function Iklan() {
    return (
        <div>
            {/* <Script type="text/javascript" id="adsterra-banner"
                strategy="lazyOnload">
                {`  atOptions = {
          'key' : '828be2ccef981f5f12ec738c59e850ea',
        'format' : 'iframe',
        'height' : 90,
        'width' : 728,
        'params' : { }
	};`}
            </Script>
            <Script id="adsterra-invoke" strategy="lazyOnload" type="text/javascript" src="//gappoison.com/828be2ccef981f5f12ec738c59e850ea/invoke.js"></Script> */}
            <Script async="async" data-cfasync="false" src="//gappoison.com/dd62acbd01d63cc71e25103c3c406976/invoke.js"></Script>
            <div id="container-dd62acbd01d63cc71e25103c3c406976"></div>
        </div>
    )
}
