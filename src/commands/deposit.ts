import process from 'node:process'
import c from 'picocolors'
import prompts from 'prompts'
import { initWallet, retry } from '../utils'

async function run() {
  const { wallet } = await initWallet()

  const depositAddress = await wallet.getSingleUseDepositAddress()
  console.log(c.bold(`存款地址: ${c.green(depositAddress)}\n`))

  const { hash } = await prompts({
    type: 'text',
    name: 'hash',
    message: '请输入存款哈希:',
  })

  const tx = await retry(wallet.claimDeposit.bind(wallet), Number.MAX_SAFE_INTEGER)(hash)
  console.log('\nTransaction:', tx)
  process.exit(0)
}

run()
