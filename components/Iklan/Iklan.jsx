'use client'
import Script from 'next/script'
import React from 'react'

export default function Iklan() {
    return (
        <div>
            <Script type='text/javascript' src='//gappoison.com/69/b8/72/69b87261afd7bdff72e56cf33ddc7552.js'></Script>
            <Script type='text/javascript' src='//gappoison.com/7f/20/c4/7f20c43dba8718a3dc89714376c16c36.js'></Script>
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
