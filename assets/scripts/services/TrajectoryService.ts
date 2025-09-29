import { _decorator } from 'cc';
import { injectable } from '../utils/DIUtils';
import { Service } from '../utils/DIUtils';
import { TrajectoriesType } from '../model/enums/TrajectoriesType';
import { AccelerateTrajectoriesData, ILinearTrajectoryData, ITrajectoryData, IZigZagTrajectoriesData } from '../interfaces/Data';
import { getRandomInRange, getRandomStringEnumValue, vec2 } from '../utils/Utils';

const MIN_RANDOM_VELOCITY = 45;
const MAX_RANDOM_VELOCITY = 60;
const DECIMALS_RANDOM_VELOCITY = 0;

const MIN_RANDOM_ACCELERATION = 1.1;
const MAX_RANDOM_ACCELERATION = 1.2;
const DECIMALS_RANDOM_ACCELERATION = 2;

const MAX_RANDOM_AMPLITUDE = 40;
const MIN_RANDOM_AMPLITUDE = 25; 

const MAX_RANDOM_FREQUENCY = 0.5;
const MIN_RANDOM_FREQUENCY = 0.1
const DECIMALS_RANDOM_FREQUENCY = 1;

@injectable('TrajectoryService')
export class TrajectoryService implements Service {        
    getPosition(trajectoryData: ITrajectoryData, startPosition: vec2, time: number): vec2 {
        switch (trajectoryData.type) {
            case TrajectoriesType.LINEAR: return this._calculateLinearPosition(trajectoryData as ILinearTrajectoryData, startPosition, time);
            case TrajectoriesType.ACCELERATE: return this._calculateAcceleratePosition(trajectoryData as AccelerateTrajectoriesData, startPosition, time);
            case TrajectoriesType.ZIG_ZAG: return this._calculateZigZigPosition(trajectoryData as IZigZagTrajectoriesData,  startPosition, time);
            default: return null;
        }
    }

    private _calculateLinearPosition(trajectoryData: ILinearTrajectoryData, startPosition: vec2, time: number): vec2 {
        const position = {
            x: startPosition.x + trajectoryData.velocity * trajectoryData.direction.x * time,
            y: startPosition.y + trajectoryData.velocity * trajectoryData.direction.y * time
        }

        return position;
    }

    private _calculateAcceleratePosition(trajectoryData: AccelerateTrajectoriesData, startPosition: vec2, time: number): vec2 {
        const position = {
            x: startPosition.x + trajectoryData.velocity * trajectoryData.direction.x * time,
            y: startPosition.y + trajectoryData.velocity * trajectoryData.direction.y * time
        }
        return position; 
    }
    
    private _calculateZigZigPosition(trajectoryData: IZigZagTrajectoriesData,  startPosition: vec2, time: number): vec2 {
        const sinValue = trajectoryData.amplitude * Math.sin(2 * Math.PI * trajectoryData.frequency * time);
        const progress = trajectoryData.velocity * time

        const position = {
            x: startPosition.x + trajectoryData.direction.x * progress - trajectoryData.direction.y * sinValue,
            y: startPosition.y + trajectoryData.direction.y * progress + trajectoryData.direction.x * sinValue,
        }

        return position;
    }

    getRandomTrajectory(): ITrajectoryData {
        const trajectoryType = getRandomStringEnumValue(TrajectoriesType);
        
        switch (trajectoryType) {
            case TrajectoriesType.LINEAR: {
                return {
                    type: TrajectoriesType.LINEAR,
                    direction: this._getRandomDirection(),
                    velocity: this._getRandomVelocity(),
                } as ILinearTrajectoryData;
            }
            
            case TrajectoriesType.ACCELERATE: {
                const velocity = this._getRandomVelocity();

                return {
                    type: TrajectoriesType.ACCELERATE,
                    direction: this._getRandomDirection(),
                    acceleration: this._getRandomAcceleration(),
                    velocity: velocity,
                    initVelocity: velocity
                } as AccelerateTrajectoriesData;
            }

            case TrajectoriesType.ZIG_ZAG: {
                return {
                    type: TrajectoriesType.ZIG_ZAG,
                    direction: this._getRandomDirection(),
                    velocity: this._getRandomVelocity(),
                    frequency: this._getRandomFrequency(),
                    amplitude: this._getRandomAmplitude()
                } as IZigZagTrajectoriesData;
            }

            default: {
                return null;
            }
        }
    }

    private readonly _getRandomDirection = () => ({ x: 0, y: -1 });
    private readonly _getRandomVelocity = (min: number = MIN_RANDOM_VELOCITY, max: number = MAX_RANDOM_VELOCITY, decimals: number = DECIMALS_RANDOM_VELOCITY) =>
        getRandomInRange(min, max, decimals);

    private readonly _getRandomAcceleration = (min: number = MIN_RANDOM_ACCELERATION, max: number = MAX_RANDOM_ACCELERATION, decimals: number = DECIMALS_RANDOM_ACCELERATION) =>
        getRandomInRange(min, max, decimals);

    private readonly  _getRandomAmplitude = (min: number = MIN_RANDOM_AMPLITUDE, max: number = MAX_RANDOM_AMPLITUDE) => 
        getRandomInRange(min, max);

    private readonly _getRandomFrequency = (min: number = MIN_RANDOM_FREQUENCY, max: number = MAX_RANDOM_FREQUENCY, decimals: number = DECIMALS_RANDOM_FREQUENCY) =>
        getRandomInRange(min, max, decimals)

    onDestroy(): void {
        
    }
}


