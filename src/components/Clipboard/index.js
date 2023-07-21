import ClipboardJs from 'react-clipboard.js';

export default function Clipboard ({
    target
}) {
    return (
        <ClipboardJs data-clipboard-target={`#${target}`} className={'d-inline btn btn-secondary target min-padding'}>
            <i className={'fas fa-copy'} style={{ fontSize: '16px', padding: '0px' }} />
        </ClipboardJs>
    );
}