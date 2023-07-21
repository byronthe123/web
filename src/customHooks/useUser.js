import { useContext } from 'react';
import { AppContext } from "../context";

export default function useUser () {
    const { user } = useContext(AppContext);
    return {
        user
    }
}