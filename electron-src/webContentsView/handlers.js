export async function executeInWebView(webView, script) {
    try {
        return await webView.webContents.executeJavaScript(script)
    } catch (err) {
        console.log(err)
        webView.webContents.openDevTools({mode: 'detach'})
        return null
    }
}

export const scrollPositionScript = `
    new Promise((resolve) => { 
      resolve({ x: window.scrollX, y: window.scrollY });
    });
  `

export const dimensionsScript = `
    new Promise((resolve) => {
      const body = document.body;
      const html = document.documentElement;
      const width = Math.max(body.scrollWidth, body.offsetWidth, html.clientWidth, html.scrollWidth, html.offsetWidth);
      const height = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
      resolve({ width, height });
    });
  `

