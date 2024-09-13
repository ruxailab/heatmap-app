import {BrowserWindow} from 'electron'
import {setTimeout} from 'timers/promises'

/**
 * Takes screenshots of the provided URLs at the specified dimensions.
 *
 * @param {Map<string, {width: number, height: number}>} urlDimensions - A Map where the keys are URLs and the values are objects containing dimensions (width and height).
 * @param {(progress: number, failedUrls: number) => void} progressCallback - A callback function that will be called with the progress of the screenshot taking process.
 * @param timeoutSeconds - The timeout in seconds for each screenshot taking operation.
 * @returns {Promise<Map<string, string | null>>} - A Promise that resolves with a Map where the keys are URLs and the values are base64 encoded images or null if the screenshot taking failed.
 */
export async function takeScreenshots(urlDimensions, progressCallback, timeoutSeconds = 4) {
    let totalUrls = urlDimensions.size
    let processedUrls = 0
    let failedUrls = 0
    let imagesMap = new Map()

    const win = new BrowserWindow({
        show: false, webPreferences: {offscreen: true},
    })

    for (let [url, dimensions] of urlDimensions) {
        await new Promise((resolve) => {
            const loadListener = () => {
                win.setContentSize(dimensions.width, dimensions.height)

                win.webContents.capturePage().then((image) => {
                    imagesMap.set(url, image.toDataURL());
                }).catch(() => {
                    imagesMap.set(url, null);
                    failedUrls++;
                }).finally(() => {
                    win.webContents.off('did-finish-load', loadListener);
                    processedUrls++;
                    progressCallback(processedUrls / totalUrls, failedUrls);
                    console.log('[LOG] Taking images: Processed:', processedUrls, 'Failed:', failedUrls);
                    resolve();
                });
            };
            //     setTimeout(1000).then(() => {
            //         win.webContents
            //             .capturePage()
            //             .then((image) => {
            //                 imagesMap.set(url, image.toDataURL())
            //             })
            //             .catch(() => {
            //                 imagesMap.set(url, null)
            //                 failedUrls++
            //             })
            //             .finally(() => {
            //                 win.webContents.off('did-finish-load', loadListener)
            //                 processedUrls++
            //                 progressCallback(processedUrls / totalUrls, failedUrls)
            //                 console.log('[LOG] Taking images: Processed:', processedUrls, 'Failed:', failedUrls)
            //                 resolve()
            //             })
            //     }).catch(() => {
            //         console.log('[LOG] Timeout Taking images: Processed:', processedUrls, 'Failed:', failedUrls)
            //         imagesMap.set(url, null)
            //         failedUrls++
            //         processedUrls++
            //         progressCallback(processedUrls / totalUrls, failedUrls)
            //         resolve()
            //     })
            // }

            const loadUrlPromise = new Promise((resolve, reject) => {
                win.webContents.on('did-finish-load', resolve);
                win.webContents.on('did-fail-load', reject);
                win.loadURL(url);
            });

            const loadUrlTimeoutPromise = new Promise((_, reject) => {
                setTimeout(timeoutSeconds * 1000).then(() => reject());
            });

            Promise.race([loadUrlPromise, loadUrlTimeoutPromise])
                .then(loadListener)
                .catch(() => {
                    win.webContents.stop();
                    imagesMap.set(url, null);
                    processedUrls++;
                    failedUrls++;
                    progressCallback(processedUrls / totalUrls, failedUrls);
                    resolve();
                });
        });
    }

    win.close()
    win.destroy()

    return imagesMap
}
