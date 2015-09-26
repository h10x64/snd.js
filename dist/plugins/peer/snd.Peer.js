(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD
        define(['snd.MediaStreamAudioDestination', 'snd.MediaStreamAudioSource'], factory);
    } else if (typeof exports === 'object') {
        // Node
    } else {
        // Browser globals (root is window)
        root.snd = factory(root.snd);
    }
}(this, function(snd) {
    
    var _peers = {};
    var _peerids = {};
    var _callConnections = {};
    var _connectConnections = {};
    var _streams = {};
    var _sources = {};
    
    snd.Peer = function(sndid, peerid, options) {
        snd.AudioUnit.apply(this, arguments);
        
        var _this = this;
        
        _peers[this.id] = new Peer(peerid, options);
        _peerids[this.id] = (peerid) ? peerid : undefined;
        _callConnections[this.id] = {};
        _connectConnections[this.id] = {};
        
        _peers[this.id].on("open", function(peerid) {
            _peerids[_this.id] = peerid;
            _this.onopen();
        });
        _peers[this.id].on("close", function() {
            _this.onclose();
        });
        _peers[this.id].on("disconnected", function() {
            _this.ondisconnected();
        });
        _peers[this.id].on("connection", function(connconn) {
            var remotePeerID = connconn.peer;
            
            _this.addConnectConnection(connconn);
            
            new Promise(function(resolve, reject) {
                _this.onconnection(remotePeerID, resolve, reject);
            }).then(function() {
                // RESOLVE
            }, function() {
                // REJECT
                _this.getConnect(remotePeerID).close();
            });
        });
        _peers[this.id].on("call", function(callconn) {
            var remotePeerID = callconn.peer;
            
            _this.addCallConnection(callconn);
            
            new Promise(function(resolve, reject) {
                _this.oncall(remotePeerID, resolve, reject);
            }).then(function(doesReturnStream, stream) {
                // RESOLVE
                if (doesReturnStream) {
                    if (stream) {
                        _this.getCall(remotePeerID).answer(stream);
                    } else {
                        _this.getCall(remotePeerID).answer(snd.STREAM_MASTER.stream);
                    }
                } else {
                    _this.getCall(remotePeerID).answer();
                }
            }, function() {
                // REJECT
                _this.getCall(remotePeerID).close();
            });
        });
        
        Object.defineProperties(this, {
            peer: {
                get: function() {
                    return _peers[this.id];
                }
            },
            peerid: {
                get: function() {
                    return _peerids[this.id];
                }
            },
            peerID: {
                get: function() {
                    return this.peerid;
                }
            },
            disconnected: {
                get: function() {
                    return _peers[this.id].disconnected;
                }
            },
            destroyed: {
                get: function() {
                    return _peers[this.id].destroyed;
                }
            }
        });
    };
    snd.Peer.prototype = Object.create(snd.AudioUnit.prototype);
    snd.Peer.prototype.constructor = snd.Peer;
    
    /* Event Method */
    
    snd.Peer.prototype.onopen = function() {};
    snd.Peer.prototype.onclose = function() {};
    snd.Peer.prototype.ondisconnected = function() {};
    snd.Peer.prototype.onerror = function() {};
    snd.Peer.prototype.oncall = function(remotePeerID, resolve, reject) {resolve(true);};
    snd.Peer.prototype.onconnection = function(remotePeerID, resolve, reject) {resolve();};
    
    snd.Peer.prototype.onstream = function(remotePeerID) {};
    snd.Peer.prototype.oncallclose = function(remotePeerID) {};
    snd.Peer.prototype.oncallerror = function(remotePeerID, err) {};
    
    snd.Peer.prototype.ondata = function(remotePeerID, data) {};
    snd.Peer.prototype.onconnectopen = function(remotePeerID) {};
    snd.Peer.prototype.onconnectclose = function(remotePeerID) {};
    snd.Peer.prototype.onconnecterror = function(remotePeerID) {};
    
    /* get Methods */
    
    snd.Peer.prototype.connectPeers = function() {
        if (_connectConnections && _connectConnections[this.id]) {
            return Object.keys(_connectConnections[this.id]);
        }
        return [];
    };
    
    snd.Peer.prototype.getConnect = function(peerid) {
        if (_connectConnections && _connectConnections[this.id]) {
            return _connectConnections[this.id][peerid];
        }
        return undefined;
    };
    
    snd.Peer.prototype.callPeers = function() {
        if (_callConnections && _callConnections[this.id]) {
            return Object.keys(_callConnections[this.id]);
        }
        return [];
    };
    
    snd.Peer.prototype.getCall = function(peerid) {
        if (_callConnections && _callConnections[this.id]) {
            return _callConnections[this.id][peerid];
        }
        return undefined;
    };
    
    snd.Peer.prototype.streamPeers = function() {
        if (_streams && _streams[this.id]) {
            return Object.keys(_streams[this.id]);
        }
        return [];
    };
    
    snd.Peer.prototype.getStream = function(peerid) {
        if (_streams && _streams[this.id]) {
            return _streams[this.id][peerid];
        }
        return undefined;
    };
    
    snd.Peer.prototype.audioSources = function() {
        if (_sources && _sources[this.id]) {
            return Object.keys(_sources[this.id]);
        }
        return [];
    };
    
    snd.Peer.prototype.getAudioSource = function(remotePeerID) {
        if (_sources && _sources[this.id]) {
            return _sources[this.id][remotePeerID];
        }
        return undefined;
    };
    
    snd.Peer.prototype.connect = function(peerid, option) {
        return this.peer.connect(peerid, option);
    };
    
    snd.Peer.prototype.call = function(remotePeerID, stream, options) {
        var callconn =  this.peer.call(remotePeerID, (stream) ? stream : snd.STREAM_MASTER.stream, options);
        this.addCallConnection(callconn);
    };
    
    snd.Peer.prototype.connect = function(remotePeerID, options) {
        var connconn =  this.peer.connect(remotePeerID, options);
        this.addCallConnection(connconn);
    };
    
    snd.Peer.prototype.disconnect = function() {
        this.peer.disconnect();
    };
    
    snd.Peer.prototype.destroy = function() {
        this.peer.destroy();
    };
    
    snd.Peer.prototype.setupConnectEvents = function(connconn) {
        var _this = this;
        var remotePeerID = connconn.peer;
        
        connconn.on("open", function() {
            _this.onconnectopen(remotePeerID);
        });
        
        connconn.on("data", function(data) {
            _this.ondata(remotePeerID, data);
        });
        
        connconn.on("error", function(err) {
            _this.onconnecterror(remotePeerID, err);
        });
        
        connconn.on("close", function() {
            _this.onconnectclose(remotePeerID);
            
            _this.removeConnectConnection(remotePeerID);
        });
    };
    
    snd.Peer.prototype.setupCallEvents = function(callconn) {
        var _this = this;
        var remotePeerID = callconn.peer;
        
        callconn.on('stream',function(stream){
            _streams[_this.id][remotePeerID] = stream;
            _sources[_this.id][remotePeerID] = new snd.MediaStreamAudioSource(remotePeerID, stream);
            _this.onstream(remotePeerID);
        });
        
        callconn.on('error', function(err) {
            _this.oncallerror(remotePeerID, err);
        });
        
        callconn.on('close', function() {
            _this.oncallclose(remotePeerID);
            
            _this.removeCallConnection(remotePeerID);
        });
    };
    
    snd.Peer.prototype.addCallConnection = function(callconn) {
        if (!_callConnections[this.id]) {
            _callConnections[this.id] = {};
        }
        if (!_streams[this.id]) {
            _streams[this.id] = {};
        }
        if (!_sources[this.id]) {
            _sources[this.id] = {};
        }
        
        this.setupCallEvents(callconn);
        
        _callConnections[this.id][callconn.peer] = callconn;
    };
    
    snd.Peer.prototype.removeCallConnection = function(remotePeerID) {
        var remote = getCall(remotePeerID);
        if (remote) {
            if (remote.open) {
                remote.close();
            }
            if (_callConnections[this.id][remotePeerID]) {
                delete _callConnections[this.id][remotePeerID];
            }
            if (_streams[this.id][remotePeerID]) {
                delete _streams[this.id][remotePeerID];
            }
            if (_sources[this.id][remotePeerID]) {
                delete _sources[this.id][remotePeerID];
            }
        }
    };
    
    snd.Peer.prototype.addConnectConnection = function(connconn) {
        if (!_connectConnections[this.id]) {
            _connectConnections[this.id] = {};
        }
        
        this.setupConnectConnection(connconn);
        
        _connectConnections[this.id][connconn.peer] = connconn;
    };
    
    snd.Peer.prototype.removeConnectConnection = function(remotePeerID) {
        var remote = this.getConnect(remotePeerID);
        if (remote) {
            if (remote.open) {
                remote.close();
            }
            if (_connectConnections[this.id][remotePeerID]) {
                delete _connectConnections[this.id][remotePeerID];
            }
        }
    };

    return snd;
}));
