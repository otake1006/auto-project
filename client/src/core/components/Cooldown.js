// components/Cooldown.js
export class Cooldown extends Component {
    constructor(skillId, cd) {
        // cd = cooldown(ms)
        super();
        this.skillId = skillId;
        this.remain = cd;
    }
}
