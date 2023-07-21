import { keyframes } from "styled-components";

export const dropIn = keyframes`
    from {
        transform: translateY(-150%);
    }
    to {
        transform: translateY(0%);
    }
`;