export default class Stat {
    constructor(name, maxValue) {
        this.name = name;
        this.max = maxValue;
        this.current = maxValue;
    }

    decrease(amount) {
        this.current = Math.max(0, this.current - amount);
    }

    increase(amount) {
        this.current = Math.min(this.max, this.current + amount);
    }

    reset() {
        this.current = this.max;
    }

    get ratio() {
        return this.current / this.max;
    }

    isEmpty() {
        return this.current <= 0;
    }
}
