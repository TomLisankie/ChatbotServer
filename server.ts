import * as express from "express";
import rs = require("rivescript");
import * as bodyParser from "body-parser";

class Server {

    public bot: rs;
    public port: any;

    constructor() {

        this.bot = new rs();
        this.bot.loadDirectory("brain", this.success, this.error_handler);

        this.port = process.env.PORT || 8080;

    }

    public success = () => {
        // the bot getting its papers in order so it can respond efficiently.
        this.bot.sortReplies();

        var app = express();
        app.use(bodyParser.json());
        app.set("json spaces", 4);
        app.post("/bot-reply-system", this.getReply);
        app.get("/", this.getUsage);
        app.get("*", this.getUsage);
        app.listen(this.port, function() {

            console.log("The server is running.");

        });

    }

    public error_handler = (loadcount, err) => {

        console.log("Error loading batch #" + loadcount + ": " + err + "\n");

    }

    public getReply = (request, response) => {

        var username = request.body.username;
        var message = request.body.message;

        if(typeof(username) === "undefined" || typeof(message) === "undefined") {

            return this.error(response, "A username and message are both required.");

        }

        var reply = this.bot.reply(username, message);

        response.json({
            "status" : "ok",
            "reply" : reply
        });

    }

    public getUsage = (request, response) => {

        response.write("I'm not answering messages here, try POSTing to my reply system!");
        response.end();

    }

    public error(response, message) {
        response.json({
            "status": "error",
            "message": message
        });
    }
    
}

var theServer = new Server();