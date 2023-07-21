import { useWindowWidth } from '@react-hook/window-size';

export default function useBreakpoint () {
    const width = useWindowWidth();
    const breakpoint = width <= 1080;
    
    return {
        breakpoint, 
        width
    }
}