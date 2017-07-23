// https://socket.io/get-started/chat/
const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const slack = require('slack')
const apiKeys = require('../../apiKeys');
const token = apiKeys.SLACK_API_TOKEN;
const bot = slack.rtm.client();


const IO_EVENT_INITIAL_PAYLOAD = 'initial payload';
const IO_EVENT_CHAT_MESSAGE = 'chat message';



// logs: ws, started, close, listen, etc... in addition to the RTM event handler methods
// console.log(Object.keys(bot));

io.on('connection', function(socket){
    socket.on('disconnect', function(){
        console.log('user disconnected');
    });
});


let initialPayload = {};
// do something with the rtm.start payload
bot.started((payload) => {
    // console.log('payload from rtm.start', payload);
    initialPayload = payload;
    // console.log("bot started successfully!!!");
    // io.emit('initial payload', payload);
});

// start listening to the slack team associated to the token
bot.listen({token:token});

bot.message((msg) => {
    // console.log('message.channels', msg);
    io.emit(IO_EVENT_CHAT_MESSAGE, msg);
});

// app.get('/', function(req, res){
//     res.sendFile(__dirname + '/index.html');
// });

io.on('connection', function(socket){
    socket.on('disconnect', function(){
        console.log('user disconnected');
    });

    io.emit(IO_EVENT_INITIAL_PAYLOAD, initialPayload);

    // bot.message((msg) => {
    //     console.log('message.channels', msg);
    //     io.emit('chat message', msg);
    // });


    // socket.on('chat message', function(msg){
    //     // console.log('message: ' + msg);
    //     io.emit('chat message', msg);
    // });
});

const port = 3001;
http.listen(3001, function(){
    console.log(`listening on *:{3001}`);
});


// // respond to a user_typing message
// bot.user_typing(function(msg) {
//     console.log('several people are coding', msg)
// })

