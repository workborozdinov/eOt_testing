import { SERVICE_TARGET_NAME } from "./Constants";
import { SortedMap } from "./SortedMap";
import { IDestroyable } from "./interfaces/IDestroyable";
import { IInitable } from "./interfaces/IInitable";
import { ILoadable } from "./interfaces/ILoadable";

export enum LoadServicePriority {
    ENVIRONMENT = 0,
    SERVER = 1,
    HIGH = 2,
    CONFIG = 3,
    SAVE = 4,
    MIDDLE = 5,
    LOW = 6,
    
    VIEW = 10
}

export interface Service extends IDestroyable, IInitable, ILoadable { }

type LoadPriority = number;

class DIContainer {
    static m = new DIContainer();

    private readonly services: Map<string, Service> = new Map();
    private readonly loadableServices: SortedMap<LoadPriority, Service[]> = new SortedMap();

    public resolveService = (serviceName: string) => {
        const result = this.services.get(serviceName);
        if (!result) {
            const msg = `[${serviceName}] -> but null!`;
            throw msg;
        }
        return result;
    }

    public bindInstance<T extends Service>(service: T) {
        return new DIServiceBuilder(this, service);
    }

    public bindService<T extends Service>(service: T, name: string) {
        this.services.set(name, service);
    }

    public addServiceToLoad(service: Service, priority: LoadPriority) {
        if (!this.loadableServices.has(priority)) this.loadableServices.set(priority, []);
        const servicesByPriority = this.loadableServices.get(priority);
        if (servicesByPriority.includes(service)) return;
        servicesByPriority.push(service);
    }

    public readonly loadServices = async (): Promise<void> => {
        const loadProcess = this.loadableServices.map(_ => _);
        for (const loads of loadProcess) {
            await Promise.all(loads.map(_ => this._doLoad(_)));
        }
        this.loadableServices.clear();

        await this._initServices();
    }

    private async _doLoad(service: Service) { await service.load?.(); }

    private _initServices() {
        return Promise.all(Array.from(this.services.values()).map(_ => _.init?.()));
    }
}

class DIServiceBuilder<T extends Service> {
    constructor(
        public readonly container: DIContainer,
        private readonly service: T
    ) { }

    readonly to = (toBindInterface: any): DIServiceBuilder<T> => {
        this.container.bindService(this.service, toBindInterface[SERVICE_TARGET_NAME]);
        return this;
    }

    readonly toSelf = () => this.to(this.service.constructor);

    readonly withLoad = (priority: LoadPriority) => {
        this.container.addServiceToLoad(this.service, priority);
        return this;
    }
}


export function inject(typeFunction: () => any) { 
    return function(target: any, key: string) {
        const init = (isGet: boolean) => function (this: any, newVal?: any) {
            Object.defineProperty(this, key, {
                get: () => DI.container.resolveService(typeFunction()[SERVICE_TARGET_NAME]),
                set: () => {},
                enumerable: true,
                configurable: true
            });

            if (isGet) return this[key];
            this[key] = newVal; 
        };

        return Object.defineProperty(target, key, {
            get: init(true),
            set: init(false),
            enumerable: true,
            configurable: true,
        });
    } 
}

export const assignName = (targetObject: any, propertyName: string, value: string) => Object.defineProperty(targetObject, propertyName, {
    value: value,
    enumerable: false,
    writable: false,
    configurable: true
});

let __global__ClassName__id__ = 0;
export function injectable(name?: string) {
    return function(target: any) {
        assignName(target, SERVICE_TARGET_NAME, name ?? `__ClassName__${++__global__ClassName__id__}`);
    }
}

export const DI = {
    container: DIContainer.m
}