import Track from './Track'

/** Godfried sequencer */
export default class Godfried {
  private tracks: Track[] = []
  public maxLength: number = 16

  private tempo: number = 120 // bpm
  private swing: number = 50 // 50 - 75

  private isPlaying: boolean = false

  private trackCounter: number = 0

  /**
   * Creates an instance of Godfried
   * @param config - maxLength, tempo & swing values
   */
  constructor (config?: GodfriedConfig) {
    this.maxLength = config?.maxLength || 32
    this.tempo = config?.tempo || 120
    this.swing = config?.swing || 50
  }

  /**
   * Gets a track from its ID
   * @param id
   * @returns Track instance
   */
  private getTrack (id: number): Track {
    return this.tracks.find(track => track.id === id)
  }

  /**
   * Adds a track
   * @returns the ID of the new track
   */
  public addTrack (): number {
    const id = this.trackCounter++
    this.tracks.push(new Track(this, { id }))
    return id
  }

  /**
   * Set any parameter (effect value) of a track
   * @param trackId
   * @param parameterName
   * @param value
   * @returns The new parameter value
   */
  public setTrackParameter (trackId: number, parameterName: string, value: any): any {
    const track = this.getTrack(trackId)
    return track.setParameter(parameterName, value)
  }

  /**
   * Set the program of a given track
   * @param trackId
   * @param rythmParams
   * @returns The new pattern
   */
  public setTrackRythm (trackId: number, rythmParams: RythmParams): boolean[] {
    const track = this.getTrack(trackId)
    return track.setRythm(rythmParams)
  }

  public setTrackSample (trackId: number, src: string): void {
    const track = this.getTrack(trackId)
    track.setSample(src)
  }

  public play (): void {
    this.isPlaying = true
    this.clock(true)
  }

  public stop (): void {
    this.isPlaying = false
  }

  private clock (reset: boolean = false): void {
    if (this.isPlaying) {
      this.tracks.forEach(track => track.trigger(reset))
      setTimeout(this.clock.bind(this), 60000 / this.tempo / 4)
    }
  }
}
