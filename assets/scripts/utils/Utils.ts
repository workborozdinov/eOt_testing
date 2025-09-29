export const VIEW_VALID_REJECT = "[VALID_REJECT]";
export const MIXIN_INIT_NAME = "__initialize_properties__";
export const EXTENDED_CLASSES = '__extendedClasses__';

export type Constructor<T = unknown> = new (...args: any[]) => T;
export type AbstractConstructor<T = unknown> = abstract new (...args: any[]) => T;

export interface vec2 { x: number; y: number; }
export interface vec3 { x: number; y: number; z: number; }
export interface color { r: number; g: number; b: number; a: number; }
export interface size { width: number, height: number; }
export interface rect extends vec2, size { }
export interface AABB { min: vec2; max: vec2; }
export interface OBB { center: vec2, axleShafts: vec2, angle: number }

export class v2 {
    static readonly EPS = 0.01;
    static readonly NEAR_EPS = 1.0;
    
    static readonly distance = (p1: vec2, p2: vec2) => Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
    static readonly pointsEqual = (p1: vec2, p2: vec2, eps = v2.EPS) => v2.distance(p1, p2) < eps;
}

export function getEnumKeyByValue<T>(enumObj: T, value: unknown): keyof T | undefined {
    const stringEnum = enumObj as Record<string, string | number>;
    return Object.keys(stringEnum).find(key =>  stringEnum[key] === value && isNaN(Number(key))) as keyof T;
};

export function capitalizeFirstSafe(str: string): string {
    if (typeof str !== 'string' || str.length === 0) return str;
    return str.split('_')
        .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
        .reduce((acc, str) => { return acc + str }, '');
}

export function getRandomStringEnumValue<T extends string>(enumObj: Record<string, T>): T {
    const values = Object.values(enumObj) as T[];
    return values[Math.floor(Math.random() * values.length)];
}

export function getRandomInRange(min: number, max: number, decimals: number = 0): number {
    const random = Math.random() * (max - min) + min;
    return Number(random.toFixed(decimals));
}
