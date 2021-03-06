﻿var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
var app = express();
var fs = require('fs');
var http = require('http');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//http.createServer(function (req, res) {
//    fs.readFile('index.html', function (err, data) {
//        res.writeHead(200, { 'Content-Type': 'text/html', 'Content-Length': data.length });
//        res.write(data);
//        res.end();
//    });
//}).listen((process.env.PORT || 3000));

app.listen((process.env.PORT || 3000));

// Server frontpage
app.get('/', function (req, res) {
    res.send('This is TestBot Server');
   

  //  sendMessage('197185364124346', 'this is test message for bots');
    console.log("Server Created for Port 3000");
});

// Facebook Webhook 
app.get('/webhook', function (req, res) {
    if (req.query['hub.verify_token'] === 'testbot_verify_token') {
        res.send(req.query['hub.challenge']);
    } else {
        res.send('Invalid verify token');
    }
});

//app.post('/webhook', function (req, res) {  
//    var events = req.body.entry[0].messaging;
//    for (i = 0; i < events.length; i++) {
//        var event = events[i];
//        if (event.message && event.message.text) {
//            sendMessage(event.sender.id, {text: "Echo: " + event.message.text});
//        }
//    }
//    res.sendStatus(200);
//});

//function sendMessage(recipientId, message) {
//    request({
//        url: 'https://graph.facebook.com/v2.6/me/messages',
//        qs: { access_token: process.env.Page_Access_Token },
//        method: 'POST',
//        json: {
//            recipient: { id: recipientId },
//            message: message,
//        }
//    }, function (error, response, body) {
//        if (error) {
//            console.log('Error sending message: ', error);
//        } else if (response.body.error) {
//            console.log('Error: ', response.body.error);
//        }
//    });
//};

//// send rich message with kitten
//function kittenMessage(recipientId, text) {

//    text = text || "";
//    var values = text.split(' ');

//    if (values.length === 3 && values[0] === 'kitten') {
//        if (Number(values[1]) > 0 && Number(values[2]) > 0) {

//            var imageUrl = "https://placekitten.com/" + Number(values[1]) + "/" + Number(values[2]);

//            message = {
//                "attachment": {
//                    "type": "template",
//                    "payload": {
//                        "template_type": "generic",
//                        "elements": [{
//                            "title": "Kitten",
//                            "subtitle": "Cute kitten picture",
//                            "image_url": imageUrl,
//                            "buttons": [{
//                                "type": "web_url",
//                                "url": imageUrl,
//                                "title": "Show kitten"
//                            }, {
//                                "type": "postback",
//                                "title": "I like this",
//                                "payload": "User " + recipientId + " likes kitten " + imageUrl,
//                            }]
//                        }]
//                    }
//                }
//            };

//    //        sendMessage(recipientId, message);


//            if (event.message && event.message.text) {
//                if (!kittenMessage(event.sender.id, event.message.text)) {
//                    sendMessage(event.sender.id, { text: "Echo: " + event.message.text });
//                }
//            }

//            return true;
//        }
//    }

//    return false;

//};


// All callbacks for Messenger will be POST-ed here
app.post("/webhook", function (req, res) {
    // Make sure this is a page subscription
    if (req.body.object == "page") {
        // Iterate over each entry
        // There may be multiple entries if batched
        req.body.entry.forEach(function (entry) {
            // Iterate over each messaging event
            entry.messaging.forEach(function (event) {
                if (event.postback) {
                    processPostback(event);
                }
            });
        });

        res.sendStatus(200);
    }
});

function processPostback(event) {
    var senderId = event.sender.id;
    var payload = event.postback.payload;

    if (payload === "Greeting") {
        // Get user's first name from the User Profile API
        // and include it in the greeting
        request({
            url: "https://graph.facebook.com/v2.6/" + senderId,
            qs: {
                access_token: process.env.Page_Access_Token,
                fields: "first_name"
            },
            method: "GET"
        }, function (error, response, body) {
            var greeting = "";
            if (error) {
                console.log("Error getting user's name: " + error);
            } else {
                var bodyObj = JSON.parse(body);
                name = bodyObj.first_name;
                greeting = "Hi " + name + ". ";
            }
            var message = greeting + "My name is SP Movie Bot. I can tell you various details regarding movies. What movie would you like to know about?";
            sendMessage(senderId, { text: message });
        });
    }
}

// sends message to user
function sendMessage(recipientId, message) {
    request({
        url: "https://graph.facebook.com/v2.6/me/messages",
        qs: { access_token: process.env.Page_Access_Token },
        method: "POST",
        json: {
            recipient: { id: recipientId },
            message: message,
        }
    }, function (error, response, body) {
        if (error) {
            console.log("Error sending message: " + response.error);
        }
    });
}

