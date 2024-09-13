import BaseTracker from '../BaseTracker.js'

class ClickTracker extends BaseTracker {
    constructor() {
        super(BaseTracker.types.CLICK)
        this.clicks = new Map()
    }

    trackClick(x, y, url) {
        const time = Date.now() - this.startTime
        const clickData = {x, y, time}

        if (this.clicks.has(url)) {
            this.clicks.get(url).push(clickData)
        } else {
            this.clicks.set(url, [clickData])
        }
    }

    getClicks() {
        return new Map(this.clicks)
    }

    getResults() {
        return {
            ...super.getResults(),
            clicks: this.getClicks()
        }
    }

    reset() {
        super.reset()
        this.clicks = new Map()
    }
}

export default ClickTracker
