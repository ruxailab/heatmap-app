class ClickTracker {
  constructor() {
    this.clicks = new Map()
    this.startTime = null
  }

  startTracking() {
    this.startTime = Date.now()
  }

  trackClick(x, y, url) {
    const time = Date.now() - this.startTime
    const clickData = { x, y, time }

    if (this.clicks.has(url)) {
      this.clicks.get(url).push(clickData)
    } else {
      this.clicks.set(url, [clickData])
    }
  }

  getClicks() {
    return this.clicks
  }

  reset() {
    this.clicks = new Map()
    this.startTime = null
  }
}

export default ClickTracker
