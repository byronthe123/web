import React from 'react';
import NewWindow from 'react-new-window';

interface Props {
    name: string,
    setName: (name: string) => void,
    setWindowOpen: (state: boolean) => void
}

export default function TestWindow ({
    name, 
    setName,
    setWindowOpen
}: Props) {
    return (
        // @ts-ignore
        <NewWindow copyStyles={true}>
            <input type={'text'} value={name} onChange={(e: any) => setName(e.target.value)} />
            <button onClick={() => setWindowOpen(false)}>close</button>
        </NewWindow>
    );
}