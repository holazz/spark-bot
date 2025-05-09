import process from 'node:process'
import c from 'picocolors'
import { initWallet, retry } from '../utils'

async function run() {
  const { wallet } = await initWallet(process.env.MNEMONIC!)

  const balances = await retry(wallet.getBalance.bind(wallet), Number.MAX_SAFE_INTEGER)()
  console.log(c.bold(c.yellow('\nBalances:')))
  console.log(balances)

  const transfers = await retry(wallet.getTransfers.bind(wallet), Number.MAX_SAFE_INTEGER)()
  console.log(c.bold(c.yellow('\nTransfers:')))
  console.log(transfers)

  process.exit(0)
}

run()
