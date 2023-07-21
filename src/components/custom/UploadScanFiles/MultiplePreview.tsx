interface Props {
    base64: string;
    number: string | number;
}

export default function MultiplePreview ({
    base64,
    number
}: Props) {
    return (
        <div className={'text-center'}>
            <img
                src={base64}
                style={{
                    maxWidth: 100,
                    height: 'auto',
                }}
            />
            <h6>{number}</h6>
        </div>
    );
}