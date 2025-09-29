import { AABB, OBB, vec2 } from "./Utils";

export namespace Colliders {

    export function checkAABBCollision(aabb1: AABB, aabb2: AABB): boolean {
        return aabb1.max.x >= aabb2.min.x && aabb1.min.x <= aabb2.max.x && aabb1.max.y >= aabb2.min.y && aabb1.min.y <= aabb2.max.y
    }

    export function transformOBB(obb: OBB, pivot: vec2 = { x: 0, y: 0 }, scale: vec2 = { x: 1, y: 1 }) {
        const cosA = Math.cos(obb.angle);
        const sinA = Math.sin(obb.angle);

        const dx = (obb.center.x - pivot.x) * scale.x;
        const dy = (obb.center.y - pivot.y) * scale.y;

        return {
            center: { x: pivot.x + (dx * cosA - dy * sinA), y: pivot.y + (dx * sinA + dy * cosA) },
            axleShafts: { x: obb.axleShafts.x * Math.abs(scale.x), y: obb.axleShafts.y * Math.abs(scale.y) },
            angle: obb.angle,
        };
    }

    export function AABBFromOBB(obb: OBB): AABB {
        const cosA = Math.cos(obb.angle);
        const sinA = Math.sin(obb.angle);

        const extentX = Math.abs(cosA) * obb.axleShafts.x + Math.abs(sinA) * obb.axleShafts.y;
        const extentY = Math.abs(sinA) * obb.axleShafts.x + Math.abs(cosA) * obb.axleShafts.y;

        return {
            min: { x: obb.center.x - extentX, y: obb.center.y - extentY },
            max: { x: obb.center.x + extentX, y: obb.center.y + extentY }
        }
    }   
}