const {
  app,
  BrowserWindow,
  ipcMain,
  dialog: { showOpenDialog }
} = require('electron')

const { basename } = require('path')

const { v4: uuidv4 } = require('uuid')

const Store = require('electron-store')

const { join } = require('path')

const musicStore = new Store({
  cwd: join(__dirname, 'data-store'),
  name: 'music'
})

console.log(musicStore.get())
;(async () => {
  await app.whenReady()

  const mainWin = new BrowserWindow({
    width: 600,
    height: 500,
    webPreferences: {
      nodeIntegration: true
    }
  })

  ipcMain.on('importMusicFile', async e => {
    const res = await showOpenDialog({
      defaultPath: '/Users/andremao/Music',
      properties: ['openFile', 'multiSelections'],
      filters: [{ name: 'Music', extensions: ['mp3'] }]
    })

    if (res.canceled) return

    // [
    // { id: 'asdfasdf', name: '嚣张.mp3', path: '/Users/andremao/Music/嚣张.mp3' }
    // { id: 'asdfasdf', name: 'Dance Monkey.mp3', path: '/Users/andremao/Music/Dance Monkey.mp3' }
    // ]

    const existingMusicArr = Object.values(musicStore.get()).map(v => v.path)
    console.log(existingMusicArr, 'existingMusicArr')

    const data = res.filePaths
      // 看目前是否已经存在，如果已经存在了，就不用导入了，
      // 怎们判断？实际就是看文件路径
      .filter(v => !existingMusicArr.includes(v))
      .map(v => ({
        id: uuidv4(),
        name: basename(v),
        path: v
      }))
      .reduce((data, v) => ({ ...data, [v.id]: v }), {})

    musicStore.set(data)

    e.reply('importMusicFile', musicStore.get())
  })

  ipcMain.on('loadMusicArr', e => {
    e.reply('loadMusicArr', musicStore.get())
  })

  mainWin.loadFile('./index.html')
})()
