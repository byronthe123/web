import { useMemo } from "react";
import { Location } from "./interfaces";

export default function useLocatedPieces (locations: Array<Location>): number {
    const locatedPieces: number = useMemo(() => {
        return locations.reduce((total: number, current: Location) => total += current.selected ? current.i_pieces : 0, 0);
    }, [locations]);
    return locatedPieces;
}