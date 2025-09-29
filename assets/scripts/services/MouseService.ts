import { _decorator, Component, director, Canvas, EventMouse, Vec2, v2, v3, input, Input } from 'cc';
import { injectable, Service } from '../utils/DIUtils';
import { Event } from '../utils/Event';

const { ccclass } = _decorator;

@injectable("MouseService")
@ccclass
export class MouseService extends Component implements Service {
    readonly onMouseMove = new Event<Vec2>(this);
    readonly onMouseDown = new Event<Vec2>(this);
    readonly onMouseUp = new Event<Vec2>(this);

    private get _mainCanvas() { return this.__mainCanvas ??= director.getScene().getComponentInChildren(Canvas); }
    private __mainCanvas: Canvas;
    
    private _pressedMouseButtons = new Set<number>();
    
    readonly isPressed = (button: number) => this._pressedMouseButtons.has(button);
    get leftPressed() { return this.isPressed(EventMouse.BUTTON_LEFT); }
    get rightPressed() { return this.isPressed(EventMouse.BUTTON_RIGHT); }

    get lastDeltaPosition() { return this._lastDeltaPosition; }
    private _lastDeltaPosition: Vec2 = v2(0, 0);

    get lastWorldPosition() { return this._lastWorldPosition; }
    private _lastWorldPosition: Vec2 = v2(0, 0); 
    
    get lastDownWorldPosition(): Vec2 { return this._lastDownWorldPosition; }
    private _lastDownWorldPosition: Vec2 = v2(0, 0);

    get currentDelta(): Vec2 { return this._currentDelta; }
    private _currentDelta: Vec2;

    onEnable() {
        this._handleSubscriptions();
    }

    private _handleSubscriptions() {
        input.on(Input.EventType.MOUSE_UP, this._handleMouseUp, this);
        input.on(Input.EventType.MOUSE_DOWN, this._handleMouseDown, this);
        input.on(Input.EventType.MOUSE_MOVE, this._handleMouseMove, this);
    }

    private _handleMouseUp(event: EventMouse) {
        this._pressedMouseButtons.delete(event.getButton());
        
        this._currentDelta = null;
        this.onMouseUp.dispatch();
    }
    private _handleMouseDown(event: EventMouse) {
        this._pressedMouseButtons.add(event.getButton());

        this._lastDownWorldPosition = this._convertToWorldPosition(event.getLocation());
        this.onMouseDown.dispatch();
    }
    private _handleMouseMove(event: EventMouse) {
        const location = event.getLocation();
        const currentPositionInWorld: Vec2 = this._convertToWorldPosition(location);

        this._lastWorldPosition = currentPositionInWorld;
        this.leftPressed && (this._currentDelta = currentPositionInWorld.subtract(this._lastDownWorldPosition));

        this.onMouseMove.dispatch();
    }

    private _convertToWorldPosition(position: Vec2): Vec2 {
        const v3Pos = this._mainCanvas.cameraComponent.screenToWorld(v3(position.x, position.y))
        return v2(v3Pos.x, v3Pos.y);
    }
    
    onDestroy() { }
}


