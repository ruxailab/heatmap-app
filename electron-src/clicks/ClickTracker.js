class ClickTracker {
  constructor() {
    this.clicks = []
    this.startTime = null
  }

  startTracking() {
    this.startTime = Date.now()
  }

  trackClick(x, y) {
    const time = Date.now() - this.startTime
    this.clicks.push({ x, y, time })
  }

  getClicks() {
    return this.clicks
  }
}

export default ClickTracker
