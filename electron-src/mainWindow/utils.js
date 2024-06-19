import { BrowserWindow } from 'electron'
import { setTimeout } from 'timers/promises'

/**
 * Takes screenshots of the provided URLs at the specified dimensions.
 *
 * @param {Map<string, {width: number, height: number}>} urlDimensions - A Map where the keys are URLs and the values are objects containing dimensions (width and height).
 * @param {(progress: number, failedUrls: number) => void} progressCallback - A callback function that will be called with the progress of the screenshot taking process.
 *
 * @returns {Promise<Map<string, string | null>>} - A Promise that resolves with a Map where the keys are URLs and the values are base64 encoded images or null if the screenshot taking failed.
 */
export async function takeScreenshots(urlDimensions, progressCallback) {
  let totalUrls = urlDimensions.size
  let processedUrls = 0
  let failedUrls = 0
  let imagesMap = new Map()

  const win = new BrowserWindow({
    show: false,
    webPreferences: { offscreen: true },
  })

  for (let [url, dimensions] of urlDimensions) {
    await new Promise((resolve) => {
      const loadListener = () => {
        win.setContentSize(dimensions.width, dimensions.height)

        setTimeout(1000).then(() => {
          win.webContents
            .capturePage()
            .then((image) => {
              imagesMap.set(url, image.toDataURL())
            })
            .catch(() => {
              imagesMap.set(url, null)
              failedUrls++
            })
            .finally(() => {
              win.webContents.off('did-finish-load', loadListener)
              processedUrls++
              progressCallback(processedUrls / totalUrls, failedUrls)
              console.log('[LOG] Taking images: Processed:', processedUrls, 'Failed:', failedUrls)
              resolve()
            })
        })
      }

      win.loadURL(url)
      win.webContents.on('did-finish-load', loadListener)
      win.webContents.on('did-fail-load', () => {
        imagesMap.set(url, null)
        processedUrls++
        failedUrls++
        progressCallback(processedUrls / totalUrls, failedUrls)
        resolve()
      })
    })
  }

  win.close()
  win.destroy()

  return imagesMap
}
