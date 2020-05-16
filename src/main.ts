import Godfried from './ts/godfried/Godfried'
import kick from './assets/kick.wav'
import snare from './assets/snare.wav'
import hat from './assets/hat.wav'
import boop from './assets/boop.wav'
import tic from './assets/tic.wav'

const G = new Godfried({ tempo: 120, maxLength: 32 })

const tracks = [
  { sample: kick, rythm: { beats: 8 } },
  { sample: snare, rythm: { beats: 4, offset: 4 } },
  { sample: hat, rythm: { beats: 8, offset: 2 } },
  { sample: boop, rythm: { beats: 13 } },
  { sample: tic, rythm: { beats: 6, lenght: 30 } },
]

tracks.forEach(track => {
  const id = G.addTrack()
  G.setTrackSample(id, track.sample)
  G.setTrackRythm(id, track.rythm)
})

document.querySelector('.start').addEventListener('click', () => {
  G.play()
})

document.querySelector('.stop').addEventListener('click', () => {
  G.stop()
})
