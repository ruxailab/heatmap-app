import BaseTracker from '../BaseTracker.js'

class MouseMovementTracker extends BaseTracker {
    constructor() {
        super(BaseTracker.types.MOUSE_MOVEMENT)
        this.movements = new Map()
        this.lastPositionTime = null
        this.lastPosition = null
        this.margin = 10
    }

    startTracking() {
        super.startTracking()
        this.lastPositionTime = this.startTime
    }

    trackMovement(x, y, url) {
        const currentTime = Date.now()
        const time = currentTime - this.startTime
        let value = 1

        if (this.lastPosition &&
            Math.abs(this.lastPosition.x - x) <= this.margin &&
            Math.abs(this.lastPosition.y - y) <= this.margin) {
            value = currentTime - this.lastPositionTime
        }

        const movementData = {x, y, value, time}

        if (this.movements.has(url)) {
            this.movements.get(url).push(movementData)
        } else {
            this.movements.set(url, [movementData])
        }

        this.lastPosition = {x, y}
        this.lastPositionTime = currentTime
    }

    getMovements() {
        return new Map(this.movements)
    }

    getResults() {
        return {
            ...super.getResults(),
            movements: this.getMovements()
        }
    }

    reset() {
        super.reset()
        this.movements = new Map()
        this.lastPositionTime = null
        this.lastPosition = null
    }
}

export default MouseMovementTracker
