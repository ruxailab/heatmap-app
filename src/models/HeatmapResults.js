export default class HeatmapResults {
  /**
   * Constructs a new HeatmapResults instance.
   * @param {Object} param0 - An object containing taskId, heatmapData, and heatmapDimensions.
   * @param {string} param0.taskId - The id of the task.
   * @param {Map<String, Object>} param0.heatmapData -  A map that represents the heatmap data. Each key is a URL, and its corresponding value is an object of the form { x: number, y: number, time: number } where 'x' and 'y' are the click coordinates and 'time' is the timestamp of the click event.
   * @param {Map<String, Object>} param0.heatmapDimensions - A map that represents the dimensions and image of the heatmap. Each key is a URL, and its corresponding value is an object in the form { dataUrl: String, width: number, height: number }. Here, 'dataUrl' is the data URL of the image, 'width' is the width of the heatmap, and 'height' is the height of the heatmap.
   */
  constructor({ taskId, heatmapData, heatmapDimensions } = {}) {
    this.taskId = taskId ?? null
    this.heatmapData = heatmapData ?? null
    this.heatmapDimensions = heatmapDimensions ?? null
  }

  static toHeatmapResults(data) {
    return new HeatmapResults(data)
  }

  toFirestore() {
    return {
      taskId: this.taskId,
      heatmapData: this.heatmapData,
      heatmapDimensions: this.heatmapDimensions,
    }
  }
}
