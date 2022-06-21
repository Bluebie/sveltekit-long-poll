/**
 * a promise that resolves after a specified delay
 * @template T
 * @param {number} durationMs - how long should it take
 * @param {T} [value] - what should the promise resolve with
 * @returns {Promise<T|void>}
 */
export default function delay (durationMs = 50, value = undefined) {
  return new Promise(resolve => setTimeout(() => resolve(value), durationMs))
}