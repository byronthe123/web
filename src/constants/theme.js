const BREAKPOINTS = {
    max: 1300,
    optimized: 1080
}

// const QUERIES = {
//     maxAndSmaller: `(max-width: ${BREAKPOINTS.max / 16}rem)`,
//     optimizedAndSmaller: `(max-width: ${BREAKPOINTS.optimized / 16}rem)`
// }

const QUERIES = {
    maxAndSmaller: `(max-width: ${BREAKPOINTS.max}px)`,
    optimizedAndSmaller: `(max-width: ${BREAKPOINTS.optimized}px)`
}

export const theme = {
    QUERIES
}

