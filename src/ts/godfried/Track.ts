import Godfried from './Godfried'

class Sample {
  private src: string
  
  constructor (src: string) {
    this.src = src
  }

  public trigger (): void {
    new Audio(this.src).play()
  }
}

export default class Track {
  // basic
  public readonly id: number

  // sound parameters
  private sample?: Sample
  private parameters: any = {
    muted: false as boolean,
    solo: false as boolean,
    volume: 1 as number,
    pan: 0 as number,
  }

  // rythm
  private beats: number = 0
  private offset: number = 0
  private length: number
  private program: boolean[]
  private currentTic: number = 0

  /**
   * Creates a track
   * @param parent The Godfried parent (only for constuction)
   * @param config Track configuration object
   */
  constructor (parent: Godfried, config: TrackConfig) {
    this.id = config.id
    this.length = parent.maxLength
  }

  /**
   * Calculates an Euclidean pattern
   * @param length Number of steps in the pattern
   * @param beats Number of beats distributed in the pattern
   * @param offset Rotation of the beat
   * @returns An Euclidean rythm as an array of booleans
   */
  public static buildProgram (length: number, beats: number, offset: number): boolean[] {
    const storedRhythm = []
    let bucket = 0

    for (let i = 0; i < length; i++) {
      bucket += beats
      storedRhythm.push(bucket >= length)
      if (bucket >= length) bucket -= length
    }

    return new Array(length).fill(false).map((step, i) => storedRhythm[Math.abs((i + length - (offset + 1)) % length)])
  }

  /**
   * Sets a parametter
   * @param parameterName
   * @param value
   */
  public setParameter (parameterName: string, value: any): any {
    if (value instanceof Function) {
      this.parameters[parameterName] = value(this.parameters[parameterName])
    } else {
      this.parameters[parameterName] = value
    }

    return this.parameters[parameterName]
  }

  /**
   * Sets the rythm
   * @param rythmParams 
   */
  public setRythm ({ beats = this.beats, offset = this.offset, length = this.length }: RythmParams): boolean[] {
    const program = Track.buildProgram(length, beats, offset)
    this.program = program
    return program
  }

  public setSample(src: string) {
    this.sample = new Sample(src)
  }

  public trigger (reset: boolean = false): void {
    if (reset) this.currentTic = 0
    
    if (this.sample) {
      if (this.program[this.currentTic]) {
        this.sample.trigger()
      }
    }

    this.currentTic = (this.currentTic + 1) % this.length
  }
}
