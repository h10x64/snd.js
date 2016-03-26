declare module snd {
    export class AudioUnit　{
        constructor(id:string);

        isAudioUnit : boolean;
        id:string;
        connection:string[];
        audioParams:any;
        status:snd.AudioUnit.Status;

        createStatus():snd.AudioUnit.Status;
        connect(connectTo:any, indexIn?:number, indexOut?:number, id?:string):void;
        connect(connectTo:any[], indexIn?:number, indexOut?:number, id?:string):void;
        disconnect(disconnectFrom:any, indexOut?:number, id?:string):void;
        disconnect(disconnectFrom:any[], indexOut?:number, id?:string):void;
        getConnector(): any;
    }

    export module AudioUnit {
        export class Status {
            constructor();

            className : string;
            isAudioUnit : boolean;
            id : string;
            connection : string[];

            channelCount : number;
            channelCountMode : string;
            channelInterpretation : string;
        }
    }
}
