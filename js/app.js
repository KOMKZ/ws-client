$(function(){
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
        }, function(c, res){
            c.info('trigger error callback');
        });

    });
    client.install_event_handler('onerror', function(){
        this.error('someting wrong', this.ws);
    });
    client.install_event_handler('onclose', function(){
        this.info('the connection has offlined');
        this.info('reconnect from 20 sec');
        setTimeout(function(){
            client.connect();
        }, 20000);
    });
    client.install_event_handler('on_server_info', function(c, data){
        c.info('receive system message :', data);
    });
    client.connect();



});
