import { _decorator, Component, Label } from 'cc';

const { ccclass, property } = _decorator;

@ccclass('Score')
export class Score extends Component {
    @property(Label) private readonly scoreLabel: Label; 
    
    setScore(score: number) { this.scoreLabel.string = score.toString(); }

    onDestroy(): void { }
}