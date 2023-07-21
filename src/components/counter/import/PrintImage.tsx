import React from 'react';

interface Props {
    base64: string;
}

export default function PrintImage ({
    base64
}: Props){

    console.log(base64);

    return (
        <div dangerouslySetInnerHTML={{ __html: `
            <!DOCTYPE html>
            <html>
                <head>
                    <link rel="stylesheet" type="text/css" media="print" href="print.css" />
                </head>
                <img src="${base64}" style="width: 100%, height: auto" />
                <script>
                    setTimeout(() => {
                        window.print();
                    }, 1000);
                </script>
            </html>
        ` }}>
        </div>
    )
}
