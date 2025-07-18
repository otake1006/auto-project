// components/SkillCast.js
export class SkillCast extends Component {
    constructor({ skillId, startTime, params }) {
        super();
        this.skillId = skillId;
        this.startTime = startTime; // server 時刻(ms)
        this.params = params; // 角度・ターゲット座標など
    }
}
