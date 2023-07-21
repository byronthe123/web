import { ISpecialHandlingCode } from "../../../globals/interfaces";

type ShcsMap = Record<string, string | null>;

function dgScreening(shcs: Array<ISpecialHandlingCode>, shcsMap: ShcsMap) {
    const map: Record<string, boolean> = {};
    for (const { s_special_handling_code, b_dg } of shcs) {
        map[s_special_handling_code] = b_dg;
    }
    for (const key in shcsMap) {
        // @ts-ignore
        if (map[shcsMap[key]]) {
            return true;
        }
    }
    return false;
}

function mustScreen(shcsMap: ShcsMap, dg: boolean, s_ccsf: string) {
    if (s_ccsf && s_ccsf.length > 0) return true;
    
    const screenedCodes: Record<string, boolean> = {
        "ELM": true,
        "ELI": true,
        "ICE": true,
        "REQ": true,
        "RRE": true,
        "RDS": true,
        "MAG": true,
        "GMO": true,
        "HUM": true,
        "AVI": true
    };
    for (const key in shcsMap) {
        const code: string = shcsMap[key] || '';
        if (screenedCodes[code]) {
            return true;
        }
    }
    return !dg;
}

export function screenDg (shcs: Array<ISpecialHandlingCode>, shcsMap: Record<string, string | null>, s_ccsf: string) {
    const dg = dgScreening(shcs, shcsMap);
    const mustScreenResult = mustScreen(shcsMap, dg, s_ccsf);
    
    return {
        dg, 
        mustScreen: mustScreenResult
    }
}