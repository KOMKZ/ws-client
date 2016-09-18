$(function(){
    var app_settings = {
        reconn_interval : 1000
    }
    var config = {
        init : function(){},
        server_addr : '127.0.0.1',
        server_port : '7272'
    };
    var client = new WsClient(config);
    client.install_event_handler('onopen', function(){
        this.info('connect successfully');
        client.send('index/login', {
            user_id : 1,
            user_token : 2
        }, function(c, res){
            c.info('trigger success callback');
            if(c.is_err(res.body.status)){
                c.error(res.body.message);
            }
        }, {
            'auth_type' : 'token',
            'auth_token' : 'ODVhNWEwM2FkOTlmYzc2YTE3YjdhYzI3ZmJlMDM0Mjk5YWVhMGUyOA==' 
        });

    });
    client.install_event_handler('onerror', function(){
        this.error('someting wrong', this.ws);
    });
    client.install_event_handler('onclose', function(){
        this.info('the connection has offlined');
        this.info('reconnect from '+app_settings.reconn_interval+' sec');
        setTimeout(function(){
            client.connect();
        }, app_settings.reconn_interval);
    });
    client.install_event_handler('on_server_info', function(c, data){
        c.info('receive system message :', data);
    });
    client.connect();



});
