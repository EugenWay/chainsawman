import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { spawn } from 'node:child_process'
import { once } from 'node:events'
import { fileURLToPath } from 'node:url'
import { findBackendPids } from '../server/stop-backend.mjs'

test('only selects this user’s Node backend, even without a pid file', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'chat-process-test-'))
  try {
    const app = path.join(root, 'app')
    const otherApp = path.join(root, 'other-app')
    const procRoot = path.join(root, 'proc')
    for (const folder of [app, otherApp, procRoot]) fs.mkdirSync(folder)
    for (const file of [path.join(app, 'index.js'), path.join(app, 'worker.js'), path.join(otherApp, 'index.js')]) fs.writeFileSync(file, '')
    const addProcess = (pid, cwd, args, executable = '/usr/bin/node') => {
      const folder = path.join(procRoot, String(pid))
      fs.mkdirSync(folder)
      fs.symlinkSync(cwd, path.join(folder, 'cwd'))
      fs.symlinkSync(executable, path.join(folder, 'exe'))
      fs.writeFileSync(path.join(folder, 'cmdline'), args.join('\0') + '\0')
    }
    addProcess(101, app, ['node', 'index.js'])
    addProcess(102, app, ['node', path.join(app, 'index.js')])
    addProcess(103, otherApp, ['node', 'index.js'])
    addProcess(104, app, ['node', 'worker.js'])
    addProcess(105, app, ['bash', 'index.js'], '/usr/bin/bash')
    addProcess(106, app, ['node', 'index.js'])
    fs.mkdirSync(path.join(procRoot, '107')) // Process exited during inspection.

    const options = { directory: app, procRoot, uid: fs.statSync(root).uid, selfPid: 106 }
    assert.deepEqual(findBackendPids(options).sort((a, b) => a - b), [101, 102])
    assert.deepEqual(findBackendPids({ ...options, uid: options.uid + 1 }), [])
  } finally { fs.rmSync(root, { recursive: true, force: true }) }
})

test('stops a running backend without stopping another Node application', { skip: process.platform !== 'linux', timeout: 15000 }, async () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'chat-stop-test-'))
  const children = []
  try {
    for (const name of ['app', 'other-app']) {
      const directory = path.join(root, name)
      fs.mkdirSync(directory)
      fs.writeFileSync(path.join(directory, 'index.js'), 'setInterval(() => {}, 1000); console.log("ready");')
      const child = spawn(process.execPath, ['index.js'], { cwd: directory, stdio: ['ignore', 'pipe', 'pipe'] })
      children.push(child)
      await once(child.stdout, 'data')
    }
    const targetExited = once(children[0], 'exit')
    const helper = fileURLToPath(new URL('../server/stop-backend.mjs', import.meta.url))
    const controller = spawn(process.execPath, [helper], { cwd: path.join(root, 'app'), stdio: 'ignore' })
    children.push(controller)
    const [exitCode] = await once(controller, 'exit')
    assert.equal(exitCode, 0)
    await targetExited
    assert.equal(children[1].exitCode, null)
    assert.doesNotThrow(() => process.kill(children[1].pid, 0))
  } finally {
    for (const child of children) if (child.exitCode === null && child.signalCode === null) child.kill()
    fs.rmSync(root, { recursive: true, force: true })
  }
})
