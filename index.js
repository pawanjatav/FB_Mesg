var express = require('express');
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
   

    sendMessage('197185364124346', 'this is test message for bots');
    console.log("Server Created for Port 3000");
});

// Facebook Webhook
app.get('/webhook', function (req, res) {
    //if (req.query['hub.verify_token'] === 'testbot_verify_token') {
    //    res.send(req.query['hub.challenge']);
    //} else {
 
    //}

    //var events = req.body.entry[0].messaging;
    //res.send(events.length);
    //for (i = 0; i < events.length; i++) {
    //    var event = events[i];
    //    if (event.message && event.message.text) {
    //        sendMessage(event.sender.id, { text: "Echo: " + event.message.text });
    //      res.send("Echo: Sender ID :: " +event.sender.id);
    //    }
    //}
    //res.sendStatus(200);


    var data = req.body;
    res.send("Echo: page :: " + data.object);
    // Make sure this is a page subscription
    if (data.object == 'page') {
        // Iterate over each entry
        // There may be multiple if batched
        data.entry.forEach(function (pageEntry) {
            var pageID = pageEntry.id;
            var timeOfEvent = pageEntry.time;
            res.send("Echo: pageID :: " + pageID);
            // Iterate over each messaging event
            pageEntry.messaging.forEach(function (messagingEvent) {
                //if (messagingEvent.optin) {
                //    receivedAuthentication(messagingEvent);
                //} else if (messagingEvent.message) {
                //    receivedMessage(messagingEvent);
                //} else if (messagingEvent.delivery) {
                //    receivedDeliveryConfirmation(messagingEvent);
                //} else if (messagingEvent.postback) {
                //    receivedPostback(messagingEvent);
                //} else {
                //    console.log("Webhook received unknown messagingEvent: ", messagingEvent);
                //}

                res.send("Echo: Sender ID :: " + messagingEvent.sender.id);

            });
        });

        // Assume all went well.
        //
        // You must send back a 200, within 20 seconds, to let us know you've 
        // successfully received the callback. Otherwise, the request will time out.
        //  res.sendStatus(200);
    }

});

// process.env.PAGE_ACCESS_TOKEN 
function sendMessage(recipientId, message) {
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: { access_token: 'EAADd0UXT6XEBAFlzejSOzHxb0Q0ZCVW5GRu1cfAeiNWcQ85ymXSVFpf2tA91K0BEqw3cHTBzZAGb3u68Xjry4qcuAQQfWX1isMXDPARyarZAGzFzcoCXvmXESYco4u2hqCNZAOiHJjEMnflS0bt5bEZCxe9A1qfUR3oVTUZAeiETqbCWcMHVSM' },
        method: 'POST',
        json: {
            recipient: { id: '197185364124346' },
            message: { text: 'this is test message for bots' },
        }
    }, function (error, response, body) {
        if (error) {
            console.log('Error sending message: ', error);
        } else if (response.body.error) {
            console.log('Error: ', response.body.error);
        }
    });
};


// send rich message with kitten
function kittenMessage(recipientId, text) {

    text = text || "";
    var values = text.split(' ');

    if (values.length === 3 && values[0] === 'kitten') {
        if (Number(values[1]) > 0 && Number(values[2]) > 0) {

            var imageUrl = "https://placekitten.com/" + Number(values[1]) + "/" + Number(values[2]);

            message = {
                "attachment": {
                    "type": "template",
                    "payload": {
                        "template_type": "generic",
                        "elements": [{
                            "title": "Kitten",
                            "subtitle": "Cute kitten picture",
                            "image_url": imageUrl,
                            "buttons": [{
                                "type": "web_url",
                                "url": imageUrl,
                                "title": "Show kitten"
                            }, {
                                "type": "postback",
                                "title": "I like this",
                                "payload": "User " + recipientId + " likes kitten " + imageUrl,
                            }]
                        }]
                    }
                }
            };

    //        sendMessage(recipientId, message);


            if (event.message && event.message.text) {
                if (!kittenMessage(event.sender.id, event.message.text)) {
                    sendMessage(event.sender.id, { text: "Echo: " + event.message.text });
                }
            }

            return true;
        }
    }

    return false;

};




