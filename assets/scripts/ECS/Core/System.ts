import { SystemType } from "../../services/SystemService";
import { IDestroyable } from "../../utils/interfaces/IDestroyable";

export abstract class System implements IDestroyable {
    isEnabled: boolean = false;

    get type(): SystemType { return this._type; }
    protected abstract _type: SystemType;
 
    abstract init(): Promise<void>;
    abstract update(dt: number): void;

    onDestroy(): void { }
}