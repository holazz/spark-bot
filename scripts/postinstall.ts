import { access, mkdir, writeFile } from 'node:fs/promises'
import { dirname, join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'
import c from 'picocolors'

const ROOT_DIR = join(dirname(fileURLToPath(import.meta.url)), '..')

async function createEnvFile(directory) {
  const filename = '.env'
  const filepath = join(directory, filename)
  try {
    await access(filepath)
  }
  catch {
    const content = `# 助记词
MNEMONIC=
`
    await mkdir(directory, { recursive: true })
    await writeFile(filepath, content)
    console.log(c.green(`Created: ${relative(ROOT_DIR, filepath)}`))
  }
}

createEnvFile(ROOT_DIR)
