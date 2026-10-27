import fs from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { setTimeout as delay } from 'node:timers/promises'

// Match this app by its owner, executable, working directory and entry point.
// The pid file may be missing after an older rsync deployment.
export function findBackendPids({ directory, procRoot = '/proc', uid = process.getuid(), selfPid = process.pid }) {
  const appDirectory = fs.realpathSync(directory)
  const entryPoint = fs.realpathSync(path.join(appDirectory, 'index.js'))
  const matches = []

  for (const name of fs.readdirSync(procRoot)) {
    if (!/^\d+$/.test(name) || Number(name) === selfPid) continue
    const proc = path.join(procRoot, name)
    try {
      if (fs.statSync(proc).uid !== uid) continue
      if (!['node', 'nodejs'].includes(path.basename(fs.readlinkSync(path.join(proc, 'exe'))))) continue
      const cwd = fs.realpathSync(path.join(proc, 'cwd'))
      if (cwd !== appDirectory) continue
      const args = fs.readFileSync(path.join(proc, 'cmdline'), 'utf8').split('\0')
      if (!args[1] || fs.realpathSync(path.resolve(cwd, args[1])) !== entryPoint) continue
      matches.push(Number(name))
    } catch (error) {
      // A process can exit while /proc is being inspected.
      if (!['ENOENT', 'ESRCH', 'EACCES', 'EPERM'].includes(error.code)) throw error
    }
  }
  return matches
}

async function stopBackend() {
  const options = { directory: process.cwd() }
  const pids = findBackendPids(options)
  for (const pid of pids) {
    console.log(`Stopping previous chat process ${pid}`)
    try { process.kill(pid, 'SIGTERM') } catch (error) {
      if (error.code !== 'ESRCH') throw error
    }
  }
  for (let attempt = 0; attempt < 100; attempt++) {
    if (findBackendPids(options).length === 0) return
    await delay(100)
  }
  throw new Error('Previous chat process did not stop; check its process supervisor')
}

if (process.argv[1] && pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url) {
  await stopBackend()
}
