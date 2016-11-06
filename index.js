'use strict'

/*
function loadScript(url, callback)
{
    // Adding the script tag to the head as suggested before
    var head = document.getElementsByTagName('head')[0];
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;
    // Then bind the event to the callback function.
    // There are several events for cross browser compatibility.
    script.onreadystatechange = callback;
    script.onload = callback;
    // Fire the loading
    head.appendChild(script);
}
loadScript("functions.js", createGameRoom);
*/

const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const app = express()
const events = require('events');

function gameRoom(id) {
    this.id = id;
    this.players = [];
}
var takenID = [];
var gameRoomArray = [];

function player (id){
    this.id = id;
    this.name = "player";
    this.alive = true;
    this.role = "villager";
    this.room;
    this.admin = false;

}

var globalPlayer = []


app.set('port', (process.env.PORT || 5000))

// Process application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))

// Process application/json
app.use(bodyParser.json())

// Index route
app.get('/', function (req, res) {
    res.send('Hello world, I am a chat bot')
})

// for Facebook verification
app.get('/webhook/', function (req, res) {
    if (req.query['hub.verify_token'] === 'werewolf_is_the_best') {
        res.send(req.query['hub.challenge'])
    }
    res.send('Error, wrong token')
})

// Spin up the server
app.listen(app.get('port'), function() {
    console.log('running on port', app.get('port'))
})

app.post('/webhook/', function (req, res) {
    let messaging_events = req.body.entry[0].messaging
    for (let i = 0; i < messaging_events.length; i++) {
        let event = req.body.entry[0].messaging[i]
        let sender = event.sender.id
        if (event.message && event.message.text) {
            let text = event.message.text

            if(text == "creategame") {
                createGameRoom(sender);
                // This is a test
                sendTextMessage(sender, "Number of Active Games: " + gameRoomArray.length);
                continue;
            }
            if (text == "image"){
                sendNightOptions(sender);
                continue;
            }

            //end game function **put with other if statements**

            if (text.substring(0,8)== "endgame ") {
                endGame(sender, text.substring(8,11));
                continue;
            }

            if (text == "image"){
                sendNightOptions(sender);
                continue;
            }

            if (text.substring(0,5) == "join "){
                joinGameRoom(sender, text);
                continue;
            }

            if (text.substring(0,6) == "start "){
                startgame(sender, text.substring(6,9));
                continue;
            }

            sendTextMessage(sender, "Welcome to the world of Werewolf! Use 'creategame' to create a gameroom, use 'join #roomID' to join a current game and use 'help' for help. (" + text.substring(0, 200) + ") is not recognized.")            
        }
        if (event.postback) {
                
                let text = JSON.stringify(event.postback)                     
                sendTextMessage(sender,text.substring(12, text.length -2 ));
                continue;
            }
    }
    res.sendStatus(200)
})

const token = "EAAFjZC8es9ZAUBACkjbZCkCvObT8B9gABy2AiBBPVZAryGVp8RKn3oRNALP8bTW0FMYWFWqiLbzccJRqtMUdaUL9hSvpKloutzlj6j8vX7ZAfHyRnohWJr3bYa3gC0nsg63NfK85oEK75oJMkqoZAOFYRAf3O95fZBdXXliJg3PEQZDZD"

function sendTextMessage(sender, text) {
    let messageData = { text:text }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:token},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
}

function messageEveryone(roomid, text) {
    let i;
    if(gameRoomArray[roomid]) {
        for(i = 0; i < gameRoomArray[roomid].players.length; i++) {
            sendTextMessage(gameRoomArray[roomid].players[i], text);
        }       
    }
    else {
        console.log('Error in callEveryone');
    }
}

function endGame(sender, id) {
    let i;
    if(gameRoomArray[id].players){
        if (sender == gameRoomArray[id].players[0]){
            for(i=0; i<globalPlayer.length; i++){
                sendTextMessage(globalPlayer[i].id,"Sorry! The admin has ended the game prematurely. The room "+id+" is deleted.");
            }
        }else{
            sendTextMessage(sender, "You are not the admin of the room "+ roomid);
        }
    } else {
        sendTextMessage(sender, "Invalid Error")
    }
    delete gameRoomArray[id].id;
    delete gameRoomArray[id].players;
}

function checkID(room){
    var i;
    for(i=0; i<takenID.length; i++){
        if (room == takenID[i]){
            room ="a" + (Math.floor(Math.random()*90000) + 10000);
            checkID(room);
        }
    }
    return room;
}



function createGameRoom (sender){
    //sendTextMessage(sender, "creating");
    let finalid = gameRoomArray.length;
    let test = new gameRoom(finalid);
    test.players.push(sender);
    gameRoomArray.push(test);

    let tempPlayer = new player(sender);
    tempPlayer.room = finalid;
    tempPlayer.name = "player" + finalid;
    
    let startMessage = { text: "You have created a game, your room ID is: "+ finalid };
    sendTextMessage(sender, startMessage);
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:token},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: startMessage,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
}

function sendNightOptions(sender) {
    let messageData = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [{
                    "title": "Night Time",
                    "subtitle": "What action do you want to do?",
                    
                    "buttons": [{
                        "type": "postback",
                        "payload": "You killed someone this turn",
                        "title": "Kill someone",
                        
                    }, {
                        "type": "postback",
                        "payload": "You did nothing this turn",
                        "title": "Do nothing",
                    }],
                }, 

                ]
            }
        }
    }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:token},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
}

function joinGameRoom(sender,text){
    //var roomIDTaken = require('data');
    if (gameRoomArray[text.substring(5,8)]){
        var alreadyJoined=0;
        if(gameRoomArray[text.substring(5,8)].players){
            for (var j=0;j<gameRoomArray[text.substring(5,8)].players.length;j++){
                if (gameRoomArray[text.substring(5,8)].players[j] == sender){
                    alreadyJoined++;
                }
            }
            if(alreadyJoined == 0){
                gameRoomArray[text.substring(5,8)].players.push(sender);
            }
            sendTextMessage(sender, "Number of players: " + gameRoomArray[text.substring(5,8)].players.length);
            var joinMessage ="you have successfully joined the room: "+ text.substring(5,8);
            sendTextMessage(sender, joinMessage);
        } else {
            sendTextMessage(sender, "Invalid Game Room");

        }
    } else{
        var joinMessage = "room ID invalid";
        sendTextMessage(sender, joinMessage);
    }

}


// Everything from turn 

Array.prototype.randomElement = function () {
    return this[Math.floor(Math.random() * this.length)]
}

function randomsort(a, b) {
    return Math.random()>.5 ? -1 : 1;
}

var arr = [1, 2, 3, 4, 5];
arr.sort(randomsort);


function playerRearrange(sender,roomid) {
    var i;
    //console.log(gameRoomArray);
    if(gameRoomArray[roomid]) {
        for(i = 0; i < gameRoomArray[roomid].players.length; i++) {
            let tempPlayer = new player(gameRoomArray[roomid].players[i]);
            tempPlayer.name = "Player" + i;
            globalPlayer.push(tempPlayer);
        }
    }
    else {
        sendTextMessage(sender, "No Active Player");
    }
}



// if admin == sender, then the game starts
function startgame(sender, roomid){
    var i;
    if (gameRoomArray[roomid]){ 
        if(gameRoomArray[roomid].players){
            playerRearrange(sender, roomid);
            //THIS iS A TEST
            //messageEveryone(roomid, "We start!");
            for (i=0; i < gameRoomArray[roomid].players.length; i++) {

                if (sender == gameRoomArray[roomid].players[0]){
                    //turn(gameRoomArray[roomid].players, turn1text);
                    messageEveryone(roomid, "Admin started game for room "+ roomid + ". Game is starting, please wait while roles are assigned.");
                    messageEveryone(roomid, "Each night, werewolves will kill one Villager. It is up to the Villagers in the morning to vote and hang who they think are the werewolves. Good game and good luck everyone!")
                    /*for(j=0; j<globalPlayer.length; j++){
                        sendTextMessage(sender, globalPlayer[j].id);
                    }*/
                    break;

                } else if (i==gameRoomArray[roomid].players.length-1){
                    sendTextMessage(sender, "You are not the admin of the room "+ roomid);
                }
            }
        } else {
            sendTextMessage(sender, "No Active GameRoom")

        }
    } else {

        sendTextMessage(sender, "No Active GameRoom")
    }
}


function turn(players, turntext){
    for (i=0; i<players.length;i++){
        sendTextMessage(players[i], "Welcome");
        };
        generateRole(roles);
 }
function generateRole(myArray){
    var randarray = myArray;
    for (i=0; i<players.length;i++){
        var rand = randarray.randomElement();
        
    };
}
