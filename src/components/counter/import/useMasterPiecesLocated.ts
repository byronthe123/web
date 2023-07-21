import { useMemo } from "react";
import { FFM, Location } from "./interfaces";

export default function useMasterPiecesLocated (
    ffms: Array<FFM>,
    locations: Array<Location>
) {

    const allMasterPiecesLocated = useMemo(() => {
        const ffmPieces = ffms.reduce((total, current) => {
            return total += current.selected ? current.i_actual_piece_count : 0;
        }, 0);

        const masterLocatedPieces = locations.reduce((total, current) => {
            return total += (current.s_hawb === null || current.s_hawb.length === 0) ? current.i_pieces : 0;
        }, 0);

        return masterLocatedPieces >= ffmPieces && masterLocatedPieces > 0 && ffmPieces > 0;
    }, [ffms, locations]);

    return allMasterPiecesLocated;
}