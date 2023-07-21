import { useContext } from 'react';
import { AppContext } from "../context";

export default function useLoading () {
    const { loading, setLoading } = useContext(AppContext);
    return {
        loading,
        setLoading
    }
}