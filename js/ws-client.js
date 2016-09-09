(function(){
    var Callback = {
        max : -1,
        valid : [],
        box : [],
        save : function(func){
            var index = undefined;
            if(this.valid.length > 0){
                index = this.valid.pop();
            }else{
                index = this.max + 1;
            }
            this.box[index] = func;
            this.max++;
            return index;
        },
        get : function(index){
            if(undefined != this.box[index]){
                var func = this.box[index];
                this.box[index] = null;
                this.valid.push(index);
                return func;
            }else{
                return undefined;
            }
        }
    }
    var Request = function(route, params, header){
        this.route = route;
        this.params = params;
        var default_header = {
            cb_index : null
        }
        this.header = merge(default_header, header);
    }
    var config = {
        init : function(){},
        server_addr : null,
        server_port : null
    };
    function WsClient(custom_config){
        // public attr
        this.config = merge(config, custom_config);
        this.ws = null;
        this.ws_event = null;

        this.event = {
            'onopen' : null,
            'onclose' : null,
            'onerror' : null
        };

        this._init();
    }
    // 初始化函数
    WsClient.prototype._init = function(){
        // todo检查必要的属性
        this.config.init();
    }
    WsClient.prototype.connect = function(){
        this.ws = connect(this.config.server_addr, this.config.server_port);
        this.ws.onopen = on_open(this);
        this.ws.onclose = on_close(this);
        this.ws.onerror = on_error(this);
        this.ws.onmessage = on_response(this);
    }


    WsClient.prototype.send = function(route, params, res, header){
        if('function' === typeof res){
            var cb_index = Callback.save(res);
        }
        var req = new Request(route, params, {
            cb_index : cb_index,
        });
        send(this.ws, req)
    }
    WsClient.prototype.install_event_handler = function(name,  handler){
        this.event[name] = handler;
    }
    WsClient.prototype.is_succ = function(status){
        return 1 === status;
    }
    WsClient.prototype.is_err = function(status){
        return 2 === status;
    }
    WsClient.prototype.is_warning = function(status){
        return 3 === status;
    }
    WsClient.prototype.is_danger = function(status){
        return 4 === status;
    }
    WsClient.prototype.info = function(msg, data){
        debug("info: " + msg);
        if(data){
            debug(data);
        }
    }
    WsClient.prototype.error = function(msg, data){
        debug("error: " + msg);
        if(data){
            debug(data);
        }
    }


    function on_response(chat_client){
        return function(res){
            var data = JSON.parse(res.data);
            if(data['route']){
                // 触发回掉函数
                if(undefined != data.header.cb_index){
                    var func = Callback.get(data.header.cb_index);
                    if('function' === typeof func){
                        func(chat_client, data);
                    }
                }
            }else if (data['event']) {
                var handler = chat_client.event[data['event']];
                if('function' === typeof handler){
                    handler(chat_client, data);
                }
            }else{
                console.log('解析消息出错');
            }
        }
    }
    function on_open(chat_client){
        return function(ws_event){
            this.ws_event = ws_event;
            if('function' === typeof chat_client.event.onopen){
                chat_client.event.onopen.call(chat_client);
            }
        }
    }
    function on_close(chat_client){
        return function(ws_event){
            this.ws_event = ws_event;
            if('function' === typeof chat_client.event.onclose){
                chat_client.event.onclose.call(chat_client);
            }
        }
    }
    function on_error(chat_client){
        return function(ws_event){
            this.ws_event = ws_event;
            if('function' === typeof chat_client.event.onerror){
                chat_client.event.onerror.call(chat_client);
            }
        }
    }

    function connect(server_addr, server_port){
        return new WebSocket("WS://" + server_addr + ":" + server_port);
    }

    function send(ws, data){
        ws.send(JSON.stringify(data));
    }
    function debug(data){
        console.log(data);
    }
    function merge(target, source) {
        if ( typeof target !== 'object' ) {
            target = {};
        }
        for (var property in source) {
            if ( source.hasOwnProperty(property) ) {
                var sourceProperty = source[ property ];
                if ( typeof sourceProperty === 'object' ) {
                    target[ property ] = merge( target[ property ], sourceProperty );
                    continue;
                }
                target[ property ] = sourceProperty;
            }
        }
        for (var a = 2, l = arguments.length; a < l; a++) {
            merge(target, arguments[a]);
        }
        return target;
    };
    this.WsClient = WsClient;
})();
