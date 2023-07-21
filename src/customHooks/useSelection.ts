import { useEffect, useState, useMemo } from "react";
import { ISelectOption } from "../globals/interfaces";

export default function useSelection (commaSeparatedString: string) {
    const [selected, setSelected] = useState<Array<ISelectOption>>([]);

    useEffect(() => {
        const stringArray = (commaSeparatedString || '').split(',');
        const optionsArray: Array<ISelectOption> = [];
        stringArray.map(string => string.length > 0 && optionsArray.push({ label: string, value: string }));
        console.log(stringArray, optionsArray);
        setSelected(optionsArray);
    }, [commaSeparatedString]);

    const selectedString = useMemo(() => {
        return selected.map(s => s.value).join(',');
    }, [selected]);

    return {
        selected, 
        setSelected,
        selectedString
    }
}