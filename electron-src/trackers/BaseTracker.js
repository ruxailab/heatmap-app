class BaseTracker {
    static types = {
        MOUSE_MOVEMENT: 'mouse-movement',
        CLICK: 'click',
    }

    constructor(type) {
        this.type = type;
        this.startTime = null;
        this.endTime = null;
        this.dimensions = new Map();
    }

    startTracking() {
        this.startTime = Date.now();
    }

    endTracking() {
        this.endTime = Date.now();
    }

    totalDuration() {
        return this.endTime - this.startTime;
    }

    setDimensions(url, width, height) {
        console.log('Setting dimensions for ', url, width, height);
        this.dimensions.set(url, {width, height});
    }

    getDimensions() {
        return new Map(this.dimensions);
    }

    getResults() {
        return {
            type: this.type,
            startTime: this.startTime,
            endTime: this.endTime,
            dimensions: this.getDimensions()
        };
    }

    reset() {
        this.startTime = null;
        this.endTime = null;
        this.dimensions = new Map();
    }
}

export default BaseTracker