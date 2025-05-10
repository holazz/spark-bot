import process from 'node:process'
import c from 'picocolors'
import prompts from 'prompts'
import { initWallet, retry } from '../utils'

async function run() {
  const { wallet } = await initWallet(process.env.MNEMONIC!)

  let { onchainAddress, amountSats, exitSpeed } = await prompts([
    {
      type: 'text',
      name: 'onchainAddress',
      message: '请输入接收地址:',
    },
    {
      type: 'number',
      name: 'amountSats',
      message: '请输入提现金额(单位: Sats, 不填写则尝试提取所有可用资金):',
    },
    {
      type: 'select',
      name: 'exitSpeed',
      message: '请选择速率:',
      choices: [
        { title: 'FAST', value: 'FAST' },
        { title: 'MEDIUM', value: 'MEDIUM' },
        { title: 'SLOW', value: 'SLOW' },
      ],
    },
  ])

  if (!amountSats) {
    const { balance } = await retry(wallet.getBalance.bind(wallet), Number.MAX_SAFE_INTEGER)()
    amountSats = Number(balance)
  }

  console.log()
  console.log(c.bold(c.yellow('提现地址:')), c.green(onchainAddress))
  console.log(c.bold(c.yellow('提现金额:')), c.green(amountSats))
  console.log(c.bold(c.yellow('提现速率:')), c.green(exitSpeed))
  console.log()

  const withdraws = await retry(
    wallet.withdraw.bind(wallet),
    Number.MAX_SAFE_INTEGER,
  )({
    onchainAddress,
    amountSats,
    exitSpeed,
  })

  console.log(c.bold(c.yellow('\nWithdraws:')))
  console.log(withdraws)

  process.exit(0)
}

run()
