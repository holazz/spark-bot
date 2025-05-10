import fsp from 'node:fs/promises'
import process from 'node:process'
import { getLatestDepositTxId } from '@buildonspark/spark-sdk'
import { generateMnemonic } from '@scure/bip39'
import { wordlist } from '@scure/bip39/wordlists/english'
import c from 'picocolors'
import prompts from 'prompts'
import { initWallet, retry } from '../utils'

async function run() {
  const mnemonic = generateMnemonic(wordlist, 128)
  const { wallet } = await initWallet(mnemonic)

  const depositAddress = await wallet.getSingleUseDepositAddress()
  console.log(c.bold(`助记词(请妥善保管): ${c.yellow(mnemonic)}\n`))
  console.log(c.bold(`存款地址: ${c.green(depositAddress)}\n`))

  const { value } = await prompts({
    type: 'confirm',
    name: 'value',
    message: '是否存款完成?',
    initial: true,
  })

  if (!value) {
    process.exit(0)
  }

  let hash
  while (!hash) {
    try {
      hash = await retry(getLatestDepositTxId.bind(wallet), 3)(depositAddress)
    }
    catch {
      ;({ hash } = await prompts({
        type: 'text',
        name: 'hash',
        message: '尝试获取存款哈希失败，请手动输入:',
      }))
    }
  }
  console.log(c.bold(`存款哈希: ${c.green(hash)}\n`))

  try {
    await fsp.access('data')
  }
  catch {
    await fsp.mkdir('data', { recursive: true })
  }

  const walletsFile = await fsp.readFile('data/wallets.json', 'utf-8').catch(() => '[]')
  const wallets = JSON.parse(walletsFile)
  const updatedWallets = [...wallets, { mnemonic, address: depositAddress, hash }]
  await fsp.writeFile('data/wallets.json', `${JSON.stringify(updatedWallets, null, 2)}\n`, 'utf-8')

  const tx = await retry(wallet.claimDeposit.bind(wallet), Number.MAX_SAFE_INTEGER)(hash!)
  console.log('\nTransaction:', tx)

  // Update .env
  await fsp.writeFile('.env', `MNEMONIC=${mnemonic}\n`, 'utf-8')
  process.exit(0)
}

run()
