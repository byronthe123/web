import { useContext, useEffect } from "react";
import { AppContext } from "../../context";

export default function manageLoading (action) {
    const { setLoading } = useContext(AppContext);
    useEffect(() => {
        setLoading(action);
    });
    return null;
}