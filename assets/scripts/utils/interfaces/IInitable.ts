export abstract class IInitable {
    abstract init?(): Promise<void> | void;
}