class TrackerManager {
    constructor() {
        this.trackers = [];
    }

    addTracker(tracker) {
        this.trackers.push(tracker);
    }

    startTracking() {
        this.trackers.forEach(tracker => tracker.startTracking());
    }

    endTracking() {
        this.trackers.forEach(tracker => tracker.endTracking());
    }

    reset() {
        this.trackers.forEach(tracker => tracker.reset());
    }

    getResults() {
        return this.trackers.map(tracker => tracker.getResults());
    }

    getTrackers() {
        return this.trackers;
    }

    getTrackerByType(type) {
        return this.trackers.find(tracker => tracker.type === type);
    }
}

export default TrackerManager;