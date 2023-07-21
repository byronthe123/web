import { IMap } from "../../../globals/interfaces";

const counterPaths: IMap<boolean> = {
    '/EOS/Operations/Counter/Queue': true,
    '/EOS/Operations/Counter/Acceptance': true,
    '/EOS/Operations/Counter/Delivery': true,
}

export default counterPaths;