(function () {

    //initialize the canvas
    var canvas = document.createElement(navigator.isCocoonJS ? "screencanvas" : "canvas");


    canvas.width = window.innerWidth * window.devicePixelRatio;
    canvas.height = window.innerHeight * window.devicePixelRatio;
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    var ctx = canvas.getContext("2d");
    document.body.appendChild(canvas);

    //some parameters
    var friendImages = [];
    var MAX_FRIEND_IMAGES = 50;
    var menuReady = false;

    var fb = CocoonJS.Social.Facebook;

    //initialize the Facebook Service the same way as the Official JS SDK
    fb.init({
        appId: "325944107441107",
        channelUrl: "channel.html"
    });

    //you can use the FB extension with the official API or use it with CocoonJS SocialGaming API
    var socialService = fb.getSocialInterface();

    socialService.setTemplates("src/engine/CocoonJSExtensions/templates/leaderboards.html", "src/engine/CocoonJSExtensions/templates/achievements.html");

    socialService.onLoginStatusChanged.addEventListener(function (loggedIn, error) {

        console.log("onLoginStatusChanged: " + loggedIn);
        //show or hide the menu depending on the login state
        if (loggedIn) {
            if (menuReady)
                CocoonJS.App.forwardAsync("CocoonJS.App.show();");
        }
        else {
            if (menuReady)
                CocoonJS.App.forwardAsync("CocoonJS.App.hide();");
        }

    });

    //Load the webview menu
    CocoonJS.App.onLoadInTheWebViewSucceed.addEventListener(function () {
        menuReady = true;
        if (socialService.isLoggedIn())
            CocoonJS.App.forwardAsync("CocoonJS.App.show();");

    });
    CocoonJS.App.onLoadInTheWebViewFailed.addEventListener(function () {
        console.error("onLoadInTheWebViewFailed");
        menuReady = true;
    });

    CocoonJS.App.loadInTheWebView("WV.html");
    //Menu methods
    window.menu = {

        showUserInfo: function () {

        },

        showFriends: function () {
            friendImages.length = 0;
            socialService.requestFriends(function (friends, error) {
                if (error) {
                    console.error("requestFriends error: " + error.message);
                }
                else {
                    for (var i = 0; i < friends.length && i < MAX_FRIEND_IMAGES; ++i) {
                        socialService.requestUserImage(function (url, error) {
                            if (!error) {
                                var img = new Image();
                                img.onload = function () {
                                    friendImages.push(img);
                                }
                                img.src = url;
                            }
                        }, friends[i].userID, CocoonJS.Social.ImageSize.MEDIUM);
                    }
                }

            });
        },

        publishAMessage: function () {
            // mediaURL, linkURL, linkText, linkCaption
            var message = new CocoonJS.Social.Message(
                "Hello from the CocoonJS Launcher App! Are you a HTML5 game developer? Come and check out CocoonJS!",
                "https://cocoonjsadmin.ludei.com/static/images/cocoon_logo.png",
                "http://ludei.com",
                "Ludei & CocoonJS",
                "We love HTML5 games!");

            socialService.publishMessageWithDialog(message, function (error) {
                if (error) {
                    console.error("Error publishing message: " + error.message);
                }
            });
        },
        showLeaderboard: function () {
            socialService.showLeaderboard(function (error) {
                if (error)
                    console.error("showLeaderbord error: " + error.message);
            });

        },
        showAchievements: function () {
            socialService.showAchievements(function (error) {
                if (error)
                    console.error("showAchievements error: " + error.message);
            });

        },
        showFriendPicker: function () {
            fb.showFriendPicker(function (friends, error) {
                if (error) {
                    console.error("showFriendPicker error: " + error);
                }
                else {
                    console.log("selected friends: " + JSON.stringify(friends));
                }
            });
        },
        logout: function () {
            socialService.logout(function (error) {
                //friendImages = [];
                //if (error)
                //console.error("logout error: " + error.message);
            });
        }
    }

    /**
     * render code
     */
    var frame = 0;
    function render() {
        var loggedIn = socialService.isLoggedIn();

        if (loggedIn && menuReady) {
            frame++;
            ctx.fillStyle = "black";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            for (var i = 0; i < friendImages.length; ++i) {
                var fx = canvas.width / 2 + 0.5 * (i / 2 + 1) * canvas.width * 0.05 * Math.sin(frame * 0.001 * i / 2 + Math.PI * (i % 2));
                var fy = canvas.height / 2 + 0.5 * (i / 2 + 1) * canvas.height * 0.05 * Math.cos(frame * 0.001 * i / 2 + Math.PI * (i % 2));
                ctx.drawImage(friendImages[i], fx, fy);
            }
        }
        else {
            ctx.fillStyle = "black";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = "white";
            ctx.font = "30px Arial";
            ctx.textAlign = "center";
            if (loggedIn) {
                ctx.fillText("Logged in. Creating menu...", canvas.width / 2, canvas.height / 2);
            }
            else {
                ctx.fillText("Logged out. Click to log in.", canvas.width / 2, canvas.height / 2);
            }
        }
    }

    function processTouch() {
        if (!socialService.isLoggedIn()) {
            socialService.login(function (loggedIn, error) {
                if (error) {
                    console.error("login error: " + error.message);
                }
                else if (loggedIn) {
                    console.log("login suceeded");
                }
                else {
                    console.log("login cancelled");
                }
            });
        }
    }

    canvas.addEventListener("mousedown", processTouch);
    canvas.addEventListener("touchstart", processTouch);

    setInterval(render, 1000 / 60);

})();


