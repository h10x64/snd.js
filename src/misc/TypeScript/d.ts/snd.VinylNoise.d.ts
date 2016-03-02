declare module snd {
  export class VinylNoise extends snd.AudioUnit {
    new (id:string, bufferLength:number, channels:number);

    volume:number;
    often:number; // 0 to 1
    maxPetitNoiseSize:number;
    minPetitNoiseSize:number;
    maxNoiseSize:number;
    probability:number;

    volumeParam:any;
  }
}
