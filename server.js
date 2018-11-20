"use strict";
exports.__esModule = true;
var express = require("express");
var rs = require("rivescript");
var bodyParser = require("body-parser");
var Server = /** @class */ (function () {
    function Server() {
        var _this = this;
        this.success = function () {
            // the bot getting its papers in order so it can respond efficiently.
            _this.bot.sortReplies();
            var app = express();
            app.use(bodyParser.json());
            app.set("json spaces", 4);
            app.post("/bot-reply-system", _this.getReply);
            app.get("/", _this.getUsage);
            app.get("*", _this.getUsage);
            app.listen(_this.port, function () {
                console.log("The server is running.");
            });
        };
        this.error_handler = function (loadcount, err) {
            console.log("Error loading batch #" + loadcount + ": " + err + "\n");
        };
        this.getReply = function (request, response) {
            var username = request.body.username;
            var message = request.body.message;
            if (typeof (username) === "undefined" || typeof (message) === "undefined") {
                return _this.error(response, "A username and message are both required.");
            }
            var reply = _this.bot.reply(username, message);
            response.json({
                "status": "ok",
                "reply": reply
            });
        };
        this.getUsage = function (request, response) {
            response.write("I'm not answering messages here, try POSTing to my reply system!");
            response.end();
        };
        this.bot = new rs();
        this.bot.loadDirectory("brain", this.success, this.error_handler);
        this.port = process.env.PORT || 8080;
    }
    Server.prototype.error = function (response, message) {
        response.json({
            "status": "error",
            "message": message
        });
    };
    return Server;
}());
var theServer = new Server();
