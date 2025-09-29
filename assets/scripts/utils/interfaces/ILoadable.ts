export abstract class ILoadable {
    abstract load?(): Promise<void> | void;
}