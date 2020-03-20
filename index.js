const { ipcRenderer } = require('electron')

const template = require('art-template/lib/template-web')

window.addEventListener('DOMContentLoaded', () => {
  const qs = (...args) => document.querySelector(...args)
  const importMusicFile = qs('#importMusicFile')
  const musicList = qs('#musicList')

  const renderMusicList = list => {
    musicList.innerHTML = template('musicItem', { data: list })
  }

  ipcRenderer.send('loadMusicArr')
  ipcRenderer.on('loadMusicArr', (e, data) => {
    console.log(data, 'data')
    renderMusicList(Object.values(data))
  })

  const audio = new Audio()

  importMusicFile.addEventListener('click', () => {
    ipcRenderer.send('importMusicFile')
  })

  ipcRenderer.on('importMusicFile', (e, data) => {
    renderMusicList(Object.values(data))
  })

  musicList.addEventListener('click', e => {
    if (e.target.classList.contains('icon-play')) {
      ;[...document.querySelectorAll('.icon-pause')].forEach(v =>
        v.classList.replace('icon-pause', 'icon-play')
      )

      console.log('播放', e.target.dataset.path)
      audio.src = e.target.dataset.path
      audio.play()
      e.target.classList.replace('icon-play', 'icon-pause')
    } else if (e.target.classList.contains('icon-pause')) {
      console.log('暂停')
      audio.pause()
      e.target.classList.replace('icon-pause', 'icon-play')
    } else if (e.target.classList.contains('icon-delete')) {
      console.log('删除')
    }
  })
})
