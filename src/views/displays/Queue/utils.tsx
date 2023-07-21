export const getName = (name: string, chars: number) => {
    if (name.length > chars) {
        return `${name.substring(0, chars)}..`;
    }
    return name;
}