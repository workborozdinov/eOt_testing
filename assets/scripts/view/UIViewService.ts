import { _decorator, Component } from 'cc';
import { injectable, Service, inject } from '../utils/DIUtils';
import { Timer } from './hud/Timer';
import { HealthBar } from './hud/HealthBar';
import { Score } from './hud/Score';
import { LocationService } from '../services/LocationService';
import { LocationModel } from '../model/Location';

const { ccclass, property } = _decorator;

@injectable('UIViewService')
@ccclass
export default class UIViewService extends Component implements Service {
    @inject(() => LocationService) private readonly _locationService: LocationService;
    
    @property(Timer) private readonly timer: Timer = null;
    @property(HealthBar) private readonly healthBar: HealthBar = null;
    @property(Score) private readonly score: Score = null;

    start() {
        this._locationService.onChangeLocation.add(this, () => this._initUI());

        this._initUI();
    }

    private _initUI() {
        this.timer.setTime(this._locationService.currentLocation.playtime);
        this.healthBar.init(this._locationService.currentLocation.health);
        this.timer.onEndTime.add(this._locationService.currentLocation, () => this._locationService.currentLocation.onEndSession.dispatch());
    
        this._subscribeLocationEvents(this._locationService.currentLocation);

    }

    private _subscribeLocationEvents(location: LocationModel) {
        location.onStartSession.add(this, () => this.timer.stopTimer().resetTimer().updateView().startTimer());
        location.onPauseSession.add(this, () => this.timer.stopTimer());
        location.onResumeSession.add(this, () => this.timer.startTimer());
        location.onEndSession.add(this, () => this.timer.stopTimer());

        location.onChangeScore.add(this, score => this.score.setScore(score));
        
        location.onIncreaseHealth.add(this, increaseHealth => this.healthBar.increaseHealth(increaseHealth));
        location.onDecreaseHealth.add(this, decreaseHealth => this.healthBar.decreaseHealth(decreaseHealth));
    }

    onDestroy(): void {
        
    }
}