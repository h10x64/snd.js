(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD
        define(['snd.AudioDataManager'], factory);
    } else if (typeof exports === 'object') {
        // Node
    } else {
        // Browser globals (root is window)
        root.snd = factory(root.snd);
    }
}(this, function(snd) {
    snd.ENCODE = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '+', '/']
    snd.DECODE = {'A': 0, 'B': 1, 'C': 2, 'D': 3, 'E': 4, 'F': 5, 'G': 6, 'H': 7, 'I': 8, 'J': 9, 'K': 10, 'L': 11, 'M': 12, 'N': 13, 'O': 14, 'P': 15, 'Q': 16, 'R': 17, 'S': 18, 'T': 19, 'U': 20, 'V': 21, 'W': 22, 'X': 23, 'Y': 24, 'Z': 25, 'a': 26, 'b': 27, 'c': 28, 'd': 29, 'e': 30, 'f': 31, 'g': 32, 'h': 33, 'i': 34, 'j': 35, 'k': 36, 'l': 37, 'm': 38, 'n': 39, 'o': 40, 'p': 41, 'q': 42, 'r': 43, 's': 44, 't': 45, 'u': 46, 'v': 47, 'w': 48, 'x': 49, 'y': 50, 'z': 51, '0': 52, '1': 53, '2': 54, '3': 55, '4': 56, '5': 57, '6': 58, '7': 59, '8': 60, '9': 61, '+': 62, '/': 63}
    
    // サーバへ配置したrbファイルのパスを指定してください。
    snd.ENCRYPT_PATH = "./prease/rewrite/this/path/";
    snd.ENCRYPT_BASE_URL = snd.ENCRYPT_PATH + "encrypt.rb?file=";
    snd.KEY_GEN_BASE_URL = snd.ENCRYPT_PATH + "createKey.rb?code=";

    snd.AudioDataManager.prototype.addEncryptSource = function(key, fileName) {
        var _this = this;
        var url = snd.ENCRYPT_BASE_URL + fileName;
        
        this._dataMap[key] = {doesLoaded: false};
        
        var encryptRequest = new XMLHttpRequest();
        encryptRequest.open("GET", url, true);
        encryptRequest.responseType = "text";
        encryptRequest.onload = function() {
            if (!encryptRequest.response) {
                console.error("Request Failed: " + encryptRequest.status);
                return;
            }
            
            _this.decrypt(encryptRequest.response, function(decrypt) {
               snd.AUDIO_CONTEXT.decodeAudioData(
                        decrypt,
                        function(buf) {
                            _this._dataMap[key].data = buf;
                            _this._dataMap[key].doesLoaded = true;
                            _this.loaded(key, buf);
                        });
            });
        };
        
        this._requests[key] = encryptRequest;
    };
    
    snd.AudioDataManager.prototype.decrypt = function(str, callback) {
        var input = str.split('|');
        
        var header = input[0];
        var dataStr = input[1];
        
        var keyRequest = new XMLHttpRequest();
        keyRequest.open("GET", snd.KEY_GEN_BASE_URL + header, true);
        keyRequest.responseType = "json";
        keyRequest.onload = function() {
            if (!keyRequest.response) {
                console.error("Request Failed: " + keyRequest.status);
                return;
            }
            
            var data = [];
            var counter = 0;
            var key = keyRequest.response.key; // 整数の配列
            for (var i = 0; i < dataStr.length; i++) {
                if (dataStr[i] != '\n' && dataStr[i] != '=') {
                    var buf = snd.DECODE[dataStr[i]];
                    buf = (buf >= key[counter]) ? buf - key[counter] : buf - key[counter] + 64;
                    data.push(snd.ENCODE[buf]);
                } else if (dataStr[i] == "=") {
                    data.push(dataStr[i]);
                }
                counter++;
                counter = counter % (key.length);
            }

            var decode = window.atob(data.join(""));

            var dataArray = new ArrayBuffer(decode.length);
            var dataBytes = new Uint8Array(dataArray);
            for (var i = 0; i < dataArray.byteLength; i++) {
                dataBytes[i] = decode.charCodeAt(i) & 0xFF;
            }
            
            callback(dataArray);
        };
        
        keyRequest.send();
    };
    
    return snd;
}));
