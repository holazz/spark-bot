import process from 'node:process'
import c from 'picocolors'
import { initWallet, retry } from '../utils'

async function run() {
  const argv = process.argv.slice(2)
  const count = Number(argv[0]) || 1
  const { wallet } = await initWallet()

  for (let i = 0; i < count; i++) {
    const transfer = await retry(
      wallet.transfer.bind(wallet),
      Number.MAX_SAFE_INTEGER,
      1000,
    )({
      amountSats: 2100,
      receiverSparkAddress: 'sp1pgssx95a30ukcewkdlnz0d2dljxwqemwwsyxpfjypuu89ef8rsjl32j59y2x0t',
    })
    console.log(c.bold(c.yellow(`\nTransfer[${i + 1}]:`)))
    console.log(transfer)
  }

  process.exit(0)
}

run()
