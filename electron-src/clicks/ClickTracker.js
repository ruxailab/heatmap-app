class ClickTracker {
  constructor() {
    this.clicks = new Map()
    this.dimensions = new Map()
    this.startTime = null
    this.endTime = null
  }

  startTracking() {
    this.startTime = Date.now()
  }

  endTracking() {
    this.endTime = Date.now()
  }

  totalDuration() {
    return this.endTime - this.startTime
  }

  setDimensions(url, width, height) {
    console.log('Setting dimensions for ', url, width, height)
    this.dimensions.set(url, { width, height })
  }

  getDimensions() {
    return new Map(this.dimensions)
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
    return new Map(this.clicks)
  }

  reset() {
    this.clicks = new Map()
    this.startTime = null
    this.endTime = null
  }
}

export default ClickTracker
