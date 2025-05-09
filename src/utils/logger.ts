import c from 'picocolors'
import { generateWalletTitle } from './index'

function formatMessage(msg: any): string {
  return typeof msg === 'string'
    ? msg
    : JSON.stringify(msg)
}

const logger = {
  info: (address: string, msg: any) => {
    console.log(
      `${c.blue('ℹ')} ${generateWalletTitle(address)} ${c.blue(formatMessage(msg))}`,
    )
  },
  error: (address: string, msg: any) => {
    console.log(`${c.red('✖')} ${generateWalletTitle(address)} ${c.red(formatMessage(msg))}`)
  },
  success: (address: string, msg: any) => {
    console.log(
      `${c.green('✔')} ${generateWalletTitle(address)} ${c.green(formatMessage(msg))}`,
    )
  },
}

export default logger
export type Logger = typeof logger

logger.info('0x123', { a: 'This is an info message' })
