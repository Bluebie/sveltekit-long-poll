import delay from './delay'

/** Append only log, observable */
export default class Log {
  constructor () {
    /** @type {any[]} */
    this.arr = []
    /** @type {function[]} */
    this.observers = []

    this.isFinished = false
  }

  /**
   * append some new events to the log
   * @param {any[]} values
   */
  push (...values) {
    this.arr.push(...values)
    // notify observers
    const observers = this.observers
    this.observers = []
    observers.forEach(x => x(this.arr))
  }

  /**
   * read any appends in the log, optionally only reading forward from an index number
   * @param {number} from - index number to read from
   */
  read (from = 0) {
    return {
      nextID: this.arr.length,
      values: this.arr.slice(from),
      isFinished: this.isFinished
    }
  }

  /**
   * @returns {Promise<void>}
   */
  wait () {
    if (this.isFinished) {
      console.log('finished, wait is immediate')
      return Promise.resolve()
    } else {
      return new Promise(resolve => {
        this.observers.push(() => resolve())
      })
    }
  }

  /**
   * read from the log, but wait if entries aren't available yet, up to an optional timeout
   * @param {number} from - index to start reading from
   * @param {number|false} timeoutMs - timeout in milliseconds
   */
  async waitRead (from = 0, timeoutMs = false) {
    console.log('waitRead', from, timeoutMs)

    while (from >= this.arr.length) {
      console.log('waiting...')
      if (typeof timeoutMs === 'number') {
        const val = await Promise.any([this.wait(), delay(timeoutMs, { timedOut: true })])
        if (val && val.timedOut) return this.read(from)
      } else {
        await this.wait()
      }
    }

    return this.read(from)
  }

  /**
   * Notify any currently waiting observers the log is finished and ends the log
   */
  destroy () {
    if (!this.isFinished) {
      this.isFinished = true
      const observers = this.observers
      this.observers = []
      observers.forEach(x => x(this.arr))
    }
  }

  /**
   * subscribe to log value changes, implementing svelte store protocol
   * @param {function} callback
   */
  subscribe (callback) {
    const log = this;
    let isSubscribed = true

    // immediately provide the current value of the log
    callback(this.arr)

    const sub = async function () {
      while (!log.isFinished && isSubscribed) {
        await log.wait()
        if (isSubscribed) callback(log.arr)
      }
    }

    const unsub = function () {
      isSubscribed = false
    }
    // start the subscription
    sub()

    return unsub
  }
}