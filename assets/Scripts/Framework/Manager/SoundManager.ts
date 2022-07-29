import { _decorator, Component, AudioSource, AudioClip } from "cc";

export class SoundManager extends Component {
  public static Instance: SoundManager = null as unknown as SoundManager;

  private static MAX_SOUND: number = 8; // 最大音效的數量

  private sounds: Array<AudioSource> = [];
  private nowIndex: number = 0;
  private bgMusic: AudioSource = null as unknown as AudioSource;


  // 靜音 => 0 ，有聲音 => 1
  private isBgMute: boolean = false;
  private isSoundMute: boolean = false;

  private bgVolume: number = 1.0;

  private bgMusicStorageKey = "GAME_MUSIC_MUTE";
  private soundStorageKey = "GAME_SOUND_MUTE";

  onLoad(): void {
    if (SoundManager.Instance === null) {
      SoundManager.Instance = this;
    } else {
      this.destroy();
      return;
    }

    this.init();
  }

  private init(): void {
    for (let i = 0; i <= SoundManager.MAX_SOUND; i++) {
      const as = this.node.addComponent(AudioSource);
      this.sounds.push(as);
    }

    this.bgMusic = this.node.addComponent(AudioSource);

    const musicValue = localStorage.getItem(this.bgMusicStorageKey);
    if (musicValue) {
      const m = parseInt(musicValue);
      this.isBgMute = m === 1;
    }

    const soundValue = localStorage.getItem(this.soundStorageKey);
    if (soundValue) {
      const s = parseInt(soundValue);
      this.isSoundMute = s === 1;
    }
  }

  public playBgMusic(clip: AudioClip, isLoop: boolean): void {
    this.bgMusic.clip = clip;
    this.bgMusic.volume = this.isBgMute ? 0 : this.bgVolume;
    this.bgMusic.loop = isLoop;
    this.bgMusic.play();
  }

  public stopBgMusic(): void {
    this.bgMusic?.stop();
  }

  public playSound(clip: AudioClip): void {
    if (this.isSoundMute) return;
    const as = this.sounds[this.nowIndex];
    this.nowIndex++;

    if (this.nowIndex >= SoundManager.MAX_SOUND) {
      this.nowIndex = 0;
    }

    as.clip = clip;
    as.loop = false;
    as.play();
  }

  public playSoundOneShot(clip: AudioClip): void {
    if (this.isSoundMute) return;
    const as = this.sounds[this.nowIndex];
    this.nowIndex++;

    if (this.nowIndex >= SoundManager.MAX_SOUND) {
      this.nowIndex = 0;
    }

    as.clip = clip;
    as.loop = false;
    as.playOneShot(clip);
  }

  public setBgMusicMute(isMute: boolean): void {
    if (!this.bgMusic) return;
    this.isBgMute = isMute;
    this.bgMusic.volume = this.isBgMute ? 0 : this.bgVolume;
    const m = isMute ? 0 : 1;
    console.log(m, isMute)
    localStorage.setItem(this.bgMusicStorageKey, m.toString());
  }

  public setSoundsMute(isMute: boolean): void {
    this.isSoundMute = isMute;
    const s = isMute ? 0 : 1;
    localStorage.setItem(this.soundStorageKey, s.toString());
  }
}
