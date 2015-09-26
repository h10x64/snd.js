require(["snd.Peer", "snd.OscillatorSource"], function(snd) {
    var doesOpened = false;
    
    // MediaStream of the micropohone
    var mic = null;
    // snd.Peer object.
    var peer;
    // Oscillator for the Tele-key.
    var osc = new snd.OscillatorSource("osc");
    // Connect oscillator to the STEAM_MASTER.
    osc.connect(snd.STREAM_MASTER);
    
    // Setup Microphone input.
    var createMicInput = function(callback) {
        // Get MediaStream
        mic = new snd.MediaStreamAudioSource(
                "micIn",            // ID
                null,               // stream: if stream is null, this calls "getUserMedia" automatically.
                true,               // useAudio: Option for "getUserMedia"
                false,              // useVideo: Option for "getUserMedia"
                function(micIn){    // Callback
                    // micIn is a snd.MediaStreamAudioSource object.
                    mic = micIn;
                    // Connect to the STREAM_MASTER.
                    // STREAM_MASTER is a master of MediaStreamDestination.
                    mic.connect(snd.STREAM_MASTER);
                    // call "callback" method;
                    callback();
                },
                function(err) {     // Error callback
                    console.log(err);
                    alert("getUserMedia failed. Please confirm to access to your microphone input.");
                }
            );
    };
    
    // Create and setting up Peer.
    var createPeers = function() {
        // Create new Peer.
        peer = new snd.Peer(
                "peer",                     // ID for snd.js
                null,                       // Peer ID
                {key:"w2c8vqcc3equmcxr"}    // Options for PeerJS.(This key is a test key. You must not use this key, except for the test.)
            );
        
        /* Setting up callbacks */
        
        // This method call when open the peer and get "PeerID".
        peer.onopen = function() {
            doesOpened = true;
            
            // You can get PeerID from "peer.peerID".
            document.getElementById("peerID0").innerHTML = "<b>" + peer.peerID + "</b>";
        };
        
        // This method call when you get call from "remotePeerID".
        peer.oncall = function(
                remotePeerID,   // ID of the remote peer
                resolve,        // Promise method
                reject          // Promise method
        ){
            if (window.confirm("Call from \"" + remotePeerID + "\".<br/> Answer this call ?")) {
                // Answer this call, but not response any streams.
                resolve(false);
            } else {
                // Close this call.
                reject();
            }
            
            // * About snd.Peer.oncall answering *
            //  resolve();                  // Answer this call but not response any streams.
            //  resolve(false);             // Same as "resolve();"
            //  resolve(true);              // Answer this call and response snd.STREAM_MASTER's stream automatically.
            //  resolve(true, someStream);  // Answer this call and response "someStream".
            //  reject();                   // Close this call.
            // ***********************************
            
        };
        
        // This method call when you get some stream from "remotePeerID".
        peer.onstream = function(remotePeerID) {
            // You can get MediaStream like ↓, if you need.
            // var stream = peer.getStream(remotePeerID);
            
            // Get snd.MediaStreamAudioSource.
            var src = peer.getAudioSource(remotePeerID);
            // Connect source to MASTER.
            src.connect(snd.MASTER);
        };
        
        // This method call when you (or remote) closed call-connection of "remotePeerID".
        peer.oncallclose = function(remotePeerID) {
            window.oncallclose(remotePeerID);
        };
    };
    
    createMicInput(createPeers);
    
    osc.connect(snd.STREAM_MASTER);
    
    /* Define grobal methods */
    
    window.call = function(remotePeerID) {
        if (!peer || !doesOpened) {
            return;
        }
        
        peer.call(remotePeerID);
    };
    
    window.hungup = function(remotePeerID) {
        if (!peer || !doesOpened) {
            return;
        }
        
        peer.getCall(remotePeerID).close();
    };
    
    /* Define Keybord events */
    
    window.onkeydown = function(evt) {
        if (!osc) {
            return;
        }
        
        if (evt.keyCode == 32) {
            osc.start();
        }
    };
    
    window.onkeyup = function(evt) {
        if (!osc) {
            return;
        }
        
        if (evt.keyCode == 32) {
            osc.stop();
        }
    };
    
    /* Set window.snd for test */
    
    window.snd = snd;
});