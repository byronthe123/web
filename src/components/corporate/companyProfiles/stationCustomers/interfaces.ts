import { IFsnLocationCode, IAirlineMappingDetail } from "../../../../globals/interfaces";

export interface IAirlineMappingDetailExtended extends IAirlineMappingDetail {
    fsnLocationCodes: Array<IFsnLocationCode>;
}