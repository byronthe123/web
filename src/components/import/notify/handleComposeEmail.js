import composeEmailBody from "./composeEmailBody";
import composeSkylineEmail from "./composeSkylineEmail";

export default function handleComposeEmail (...args) {
    const skylineEmail = args[0];
    if (skylineEmail) {
        return composeSkylineEmail(...args);
    } else {
        return composeEmailBody (...args);
    }
}