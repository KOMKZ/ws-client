
$(function(){
    function debug(data){
        if(typeof console.log === 'function'){
            return console.log(data);
        }
    }
    var chat_config = {
        init : function(){},
        server_addr : '127.0.0.1',
        server_port : '7272',
        auth_url : 'http://localhost/worktools/frontend/web/rbac',
    };
    var chat_client = new ChatClient(chat_config);
    chat_client.install_event_handler(chat_client.event.new_join_chanel, handle_res);
    chat_client.install_event_handler(chat_client.event.new_chanel_msg, handle_res);

    chat_client.connect();

    chat_client.open = function(){
        debug('连接成功');
    }
    chat_client.close = function(){
        this.connect();
    }



    function outputJson(obj){
        $('#response').html(prettyPrint(obj, {maxDepth : 10}));
    }
    function handle_res(chat_client, res){
        outputJson(res);
    }





    // user-controller
    $('#login').click(function(){
        chat_client.send('user/login', {name : 'kitral'}, handle_res);
    });
    $('#logout').click(function(){
        chat_client.send('user/logout', {}, handle_res);
    });



    // chat-controller
    $('#say-in-chanel').click(function(){
        chat_client.send('chat/say-in-chanel', {
            chanel_id : 1000,
            data : 'hello world',
        }, handle_res);
    });

    // chanel-controller
    $('#join-public-chanel').click(function(){
        chat_client.send('chanel/join-public-chanel', {chanel_id : 1000}, handle_res);
    });
    $('#get-public-chanel').click(function(){
        chat_client.send('chanel/get-public-chanel', {chanel_id : 1000}, handle_res);
    });
    $('#append-to-say-black-list').click(function(){
        chat_client.send('chanel/append-to-say-black-list', {chanel_id : 1000 , user_id : 999999}, handle_res);
    });
    $('#remove-from-say-black-list').click(function(){
        chat_client.send('chanel/remove-from-say-black-list', {chanel_id : 1000 , user_id : 999999}, handle_res);
    });
    $('#append-to-join-black-list').click(function(){
        chat_client.send('chanel/append-to-join-black-list', {chanel_id : 1000 , user_id : 999999}, handle_res);
    });
    $('#remove-from-join-black-list').click(function(){
        chat_client.send('chanel/remove-from-join-black-list', {chanel_id : 1000 , user_id : 999999}, handle_res);
    });
    $('#set-deny-say-true').click(function(){
        chat_client.send('chanel/set-deny-say', {chanel_id : 1000 , status : 1}, handle_res);
    });
    $('#set-deny-say-false').click(function(){
        chat_client.send('chanel/set-deny-say', {chanel_id : 1000 , status : 0}, handle_res);
    });
    $('#set-allow-join-true').click(function(){
        chat_client.send('chanel/set-allow-join', {chanel_id : 1000 , status : 1}, handle_res);
    });
    $('#set-allow-join-false').click(function(){
        chat_client.send('chanel/set-allow-join', {chanel_id : 1000 , status : 0}, handle_res);
    });
    $('#get-chanel-users').click(function(){
        chat_client.send('chanel/get-chanel-users', {chanel_id : 1000}, handle_res);
    });

    $('#update-chanel').click(function(){
        chat_client.send('chanel/update-chanel', {
            chanel_id : 1000,
            data : {
                // 'chanel_name' : '测试频道',
                // 'chanel_intro' : '测试频道的介绍',
                // 'max_num' : 1001,
                // 'allow_join' : 1,
                // 'join_white_list' : '',
                // 'join_black_list' : [9999],
                // 'deny_say' : 0,
                // 'tiantian' : '美丽的世界',
                // 'say_white_list' : '',
                // 'say_black_list' : [11111],
                'say_interval' : 2
            }
        }, handle_res);
    });


    $('#create-public-chanel').click(function(){
        chat_client.send('chanel/create-public-chanel', {
            data : {
                'chanel_name' : '测试频道',
                'chanel_intro' : '测试频道的介绍',
                'max_num' : 100,
                'allow_join' : 1,
                'join_white_list' : '',
                'join_black_list' : '',
                'deny_say' : 0,
                'say_white_list' : '',
                'say_black_list' : '',
                'say_interval' : 0
            }
        }, handle_res);
    });

});
