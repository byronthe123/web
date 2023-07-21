import { useMemo } from "react";

export default function useStorge(
    weight: number,
    storageDays: number,
    f_import_per_kg: number,
    f_import_min_charge: number,
    altStorage?: boolean,
    altStorageAmount?: number
) {

    console.log(f_import_per_kg, f_import_min_charge);

    const dailyStorage: number = useMemo(() => {
        return Number(
            Math.max(weight * f_import_per_kg, f_import_min_charge).toFixed(2)
        );
    }, [weight, f_import_per_kg, f_import_min_charge]);

    const totalStorage: number = altStorage
        ? altStorageAmount || 0
        : Math.max(dailyStorage * storageDays, 0);

    // console.log(
    //     totalStorage,
    //     { dailyStorage },
    //     { storageDays },
    //     weight,
    //     f_import_per_kg,
    //     f_import_min_charge,
    //     altStorage
    // );

    return {
        dailyStorage,
        totalStorage,
    };
}
