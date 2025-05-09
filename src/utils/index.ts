import process from 'node:process'
import { SparkWallet } from '@buildonspark/spark-sdk'
import c from 'picocolors'
import 'dotenv/config'

export async function initWallet() {
  const { wallet, mnemonic } = await SparkWallet.initialize({
    mnemonicOrSeed: process.env.MNEMONIC,
    options: {
      network: 'MAINNET',
    },
  })
  return { wallet, mnemonic }
}

export function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export function getErrorMessage(error: any) {
  const errorPaths = [
    ['response', 'data', 'message'],
    ['response', 'data', 'error'],
    ['response', 'data'],
    ['response', 'statusText'],
    ['error', 'reason'],
    ['cause'],
    ['reason'],
    ['message'],
  ]

  for (const path of errorPaths) {
    let value = error
    for (const key of path) {
      if (value === null || value === undefined)
        break
      value = value[key]
    }
    if (value) {
      return typeof value === 'object' ? JSON.stringify(value, Object.getOwnPropertyNames(value)) : String(value)
    }
  }
  return 'error'
}

export function retry<A extends unknown[], T>(fn: (...args: A) => Promise<T>, times = 0, delay = 0) {
  return (...args: A): Promise<T> =>
    new Promise((resolve, reject) => {
      const attempt = async () => {
        try {
          resolve(await fn(...args))
        }
        catch (err: any) {
          console.log(c.red(`[${fn.name || 'anonymous'}] ${getErrorMessage(err)}`))
          if (times-- <= 0) {
            reject(err)
          }
          else {
            setTimeout(attempt, delay)
          }
        }
      }
      attempt()
    })
}
