export default function calcStorage(
    weight: number, 
    f_import_per_kg: number, 
    f_import_min_charge: number
) {

    const dailyStorage: number = Number(Math.max((weight * f_import_per_kg), f_import_min_charge).toFixed(2));

    return dailyStorage

}