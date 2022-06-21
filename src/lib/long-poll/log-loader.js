import delay from './delay'
import Log from './log'

/**
 * Connect to a server side log using long polling
 * @param {string} endpoint - url to endpoint which serves up long polling access to log
 */
export default function connectToLog (endpoint) {
  const log = new Log()
  const url = new URL(endpoint, window.location.href)
  url.searchParams.set('nextID', '0')

  const aborter = new AbortController()

  // override the destroy function to also cancel the http request
  const logDestroyer = log.destroy
  log.destroy = function () {
    // call the original log destroyer on log
    logDestroyer.call(log)
    aborter.abort()
  }

  async function doFetch () {
    let response
    try {
      response = await fetch(url.toString(), {
        cache: 'no-store',
        signal: aborter.signal
      })
    } catch (err) {
      console.info('fetch error', err)
      // since there was probably a network or server failure, back off and wait for five minutes before reattempting
      await delay(5000)
      doFetch()
      return
    }

    const json = await response.json()

    // update the fetching url to have the new updated ID value
    url.searchParams.set('nextID', `${json.nextID}`)

    log.push(...json.values)
    if (json.isFinished) logDestroyer.call(log)

    if (!log.isFinished) {
      // lets just wait 0.05 seconds before doing the next request, idk why, just feels right
      await delay(50)
      doFetch() // do it again!
    }
  }

  doFetch()
  return log
}