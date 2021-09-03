game.module(
    'game.scenes'
)
    .require(
        'engine.scene'
    )
    .body(function () {

        SceneGame = game.Scene.extend({
            backgroundColor: 0x9ac4f7,
            gapTime: 1700,
            gravity: 2000,
            score: 0,
            cloudSpeedFactor: 1,

            init: function () {
                this.world = new game.World(0, this.gravity);

                this.addParallax(400, 'media/parallax1.png', -50);
                this.addParallax(550, 'media/parallax2.png', -100);
                this.addParallax(650, 'media/parallax3.png', -200);

                this.addCloud(100, 100, 'media/cloud1.png', -50);
                this.addCloud(300, 50, 'media/cloud2.png', -30);

                this.logo = new Logo();

                this.addCloud(650, 100, 'media/cloud3.png', -50);
                this.addCloud(700, 200, 'media/cloud4.png', -40);

                this.addParallax(700, 'media/bushes.png', -250);
                this.gapContainer = new game.Container();
                this.stage.addChild(this.gapContainer);
                this.addParallax(game.system.height - 400, 'media/ground.png', -300);

                this.player = new Player();

                var groundBody = new game.Body({
                    position: { x: game.system.width / 2, y: game.system.height - 350 },
                    collisionGroup: 0
                });
                var groundShape = new game.Rectangle(game.system.width, 100);
                groundBody.addShape(groundShape);
                this.world.addBody(groundBody);

                this.scoreText = new game.BitmapText(this.score.toString(), { font: 'Pixel' });
                this.scoreText.position.x = game.system.width / 2 - this.scoreText.textWidth / 2;
                this.stage.addChild(this.scoreText);

                var isSound = parseInt(game.storage.get('sound'));
                if (isNaN(isSound)) game.storage.set('sound', 1);

                if (parseInt(game.storage.get('sound')) === 1) {
                    game.audio.musicVolume = 0.6;
                    game.audio.playMusic('music');
                }

            },

            spawnGap: function () {
                this.addObject(new Gap());
                if (this.score === 2) {
                    this.removeTimer(this.gapTimer);
                    this.gapTimer = this.addTimer(this.gapTime - 200, this.spawnGap.bind(this), true);
                }
                if (this.score === 85) {
                    this.removeTimer(this.gapTimer);
                    this.gapTimer = this.addTimer(this.gapTime - 150, this.spawnGap.bind(this), true);
                }
            },

            addScore: function () {
                this.score++;
                this.scoreText.setText(this.score.toString());
                if (parseInt(game.storage.get('sound')) === 1) {
                    game.audio.playSound('score');
                }
            },

            addCloud: function (x, y, path, speed) {
                var cloud = new Cloud(path, x, y, { speed: speed });
                this.addObject(cloud);
                this.stage.addChild(cloud);
            },

            addParallax: function (y, path, speed) {
                var parallax = new game.TilingSprite(path);
                parallax.position.y = y;
                parallax.speed.x = speed;
                this.addObject(parallax);
                this.stage.addChild(parallax);
            },

            mousedown: function () {
                if (this.ended) return;
                if (this.player.body.mass === 0) {
                    game.analytics.event('play');
                    this.player.body.mass = 1;
                    this.logo.remove();
                    this.gapTimer = this.addTimer(this.gapTime, this.spawnGap.bind(this), true);
                }
                this.player.jump();
            },

            showScore: function () {

                var endText = '';

                //Month 6 
                //Day 26 = San Juan La Saca
                var date = new Date();
                var month = date.getMonth() + 1;
                var day = date.getDate();

                var gameOverTextsNormal = [
                    'NO LLEGAS AL\rVIERNES DE TOROS!',
                    'KEEP CALM\rAND DRINK WINE!',
                    'TE ESTAS CARGANDO\rLAS FIESTAS!',
                    'EN TU PUEBLO\rTE LLAMAN FENOMENO',
                    'NI QUE FUESE\rMARTES ESCUELA!',
                    'CUANDO EL TORO\rVUELA BAJO...',
                    'MAS VALE\rY MAS DARAN',
                    'POR FAVOR,\rDESALOJA EL JUEGO',
                    'NO HAY SITIO\rPARA LOSERS',
                    'A ESTE RITMO\rVAS A MACERAR',
                    'NO VAS A SALIR\rEN SANJUANEANDO.COM',
                    'DALE MAS VINO\rAL ZAGAL',
                    'EN LA PLAZA ESTAN\rORGULLOSOS DE TI',
                    'UNA PISTA, CONSISTE\rEN LANZAR AROS'
                ];

                var gameOverTextsPro = [
                    'TE ESTAS\rPONIENDO FUERTE',
                    'MENOS JUGAR Y\rMAS SANJUANEAR',
                    'A ESTE PASO TE\rVAN A HACER JURADO',
                    'ERES EL MASTER\rDE TU CHUPIPANDI',
                    'DALE AMOR\rAL TORO, PRO',
                    'ESTOS SANJUANES A\rVALONSADERO VOLANDO'
                ];

                //Cases
                if (this.score === 10) {
                    endText = 'AHI LE DEJO\rMIS DIES';
                } else if (this.score === 12) {
                    endText = '12 CUADRILLAS\rTIENE SAN JUAN';
                } else {
                    if (month === 6 && day === 26) {
                        //La Saca
                        var randomGameOver = Math.floor((Math.random() * gameOverTextsNormal.length) + 0);
                        endText = gameOverTextsNormal[randomGameOver];
                    } else {
                        if (this.score >= 25) {
                            //Normal days pro
                            var randomGameOver = Math.floor((Math.random() * gameOverTextsPro.length) + 0);
                            endText = gameOverTextsPro[randomGameOver];
                        } else {
                            //Normal days noob
                            var randomGameOver = Math.floor((Math.random() * gameOverTextsNormal.length) + 0);
                            endText = gameOverTextsNormal[randomGameOver];
                        }
                    }
                }

                var box = new game.Sprite('media/gameover.png', game.system.width / 2, game.system.height / 2 - 150, { anchor: { x: 0.5, y: 0.5 } });

                this.gagText = new game.BitmapText(endText, {
                    font: 'Pixel',
                    tint: 0xffe362,
                    align: 'center'
                });
                this.gagText.position.x = game.system.width / 2 - this.gagText.textWidth / 2;
                this.gagText.position.y = game.system.height / 2 - 290;


                var highScore = parseInt(game.storage.get('highScore')) || 0;
                if (this.score > highScore) game.storage.set('highScore', this.score);

                var score = this.score;

                var highScoreText = new game.BitmapText(highScore.toString(), { font: 'Pixel' });
                highScoreText.position.x = 27;
                highScoreText.position.y = 43;
                box.addChild(highScoreText);

                var scoreText = new game.BitmapText('0', { font: 'Pixel' });
                scoreText.position.x = highScoreText.position.x;
                scoreText.position.y = -21;
                box.addChild(scoreText);

                game.scene.stage.addChild(box);
                game.scene.stage.addChild(this.gagText);

                this.restartButton = new game.Sprite('media/restart.png', game.system.width / 2, game.system.height / 2 + 130, {
                    anchor: { x: 0.5, y: 0.5 },
                    scale: { x: 0, y: 0 },
                    interactive: true,
                    mousedown: function () {
                        var tween = new game.Tween(this.scale)
                            .to({ x: 2, y: 2 }, 100)
                            .easing(game.Tween.Easing.Back.Out);
                        tween.repeat(1);
                        tween.yoyo();
                        tween.start();
                        game.analytics.event('restart');
                        game.system.setScene(SceneGame);
                    }
                });

                var soundMedia = 'media/sound.png';
                if (parseInt(game.storage.get('sound')) === 0) soundMedia = 'media/no-sound.png';
                this.soundButton = new game.Sprite(soundMedia, (game.system.width / 2) + 150, game.system.height / 2 + 330, {
                    anchor: { x: 0.5, y: 0.5 },
                    scale: { x: 0.5, y: 0.5 },
                    interactive: true,
                    mousedown: function () {
                        var tween = new game.Tween(this.scale)
                            .to({ x: 2, y: 2 }, 100)
                            .easing(game.Tween.Easing.Back.Out);
                        tween.repeat(1);
                        tween.yoyo();
                        tween.start();

                        if (parseInt(game.storage.get('sound')) === 1) {
                            this.setTexture('media/no-sound.png');
                            game.storage.set('sound', 0);
                        } else {
                            this.setTexture('media/sound.png');
                            game.storage.set('sound', 1);
                            game.audio.playSound('jump');
                        }
                    }
                });

                this.twitterButton = new game.Sprite('media/twitter.png', (game.system.width / 2), game.system.height / 2 + 330, {
                    anchor: { x: 0.5, y: 0.5 },
                    scale: { x: 0.5, y: 0.5 },
                    interactive: true,
                    mousedown: function () {
                        var tween = new game.Tween(this.scale)
                            .to({ x: 2, y: 2 }, 100)
                            .easing(game.Tween.Easing.Back.Out);
                        tween.repeat(1);
                        tween.yoyo();
                        tween.start();
                        shareOnTwitter(score);
                    }
                });

                this.facebookButton = new game.Sprite('media/facebook.png', game.system.width / 2 - 150, game.system.height / 2 + 330, {
                    anchor: { x: 0.5, y: 0.5 },
                    scale: { x: 0.5, y: 0.5 },
                    interactive: true,
                    mousedown: function () {
                        var tween = new game.Tween(this.scale)
                            .to({ x: 2, y: 2 }, 100)
                            .easing(game.Tween.Easing.Back.Out);
                        tween.repeat(1);
                        tween.yoyo();
                        tween.start();
                        shareOnFacebook(score);
                    }
                });


                if (this.score > 0) {
                    var time = Math.min(100, (1 / this.score) * 500);
                    var scoreCounter = 0;
                    this.addTimer(time, function () {
                        scoreCounter++;
                        scoreText.setText(scoreCounter.toString());
                        if (scoreCounter >= game.scene.score) {
                            this.repeat = false;
                            if (game.scene.score > highScore) {
                                if (parseInt(game.storage.get('sound')) === 1) {
                                    game.audio.playSound('highscore');
                                }
                                var newBox = new game.Sprite('media/new.png', -208, 59);
                                box.addChild(newBox);
                            }
                            game.scene.showRestartButton();
                        }
                    }, true);
                } else {
                    this.showRestartButton();
                }
            },

            showRestartButton: function () {
                var tween = new game.Tween(this.restartButton.scale)
                    .to({ x: 1.3, y: 1.3 }, 200)
                    .easing(game.Tween.Easing.Back.Out);
                tween.start();
                this.stage.addChild(this.restartButton);

                var tween = new game.Tween(this.soundButton.scale)
                    .to({ x: 1.5, y: 1.5 }, 200)
                    .easing(game.Tween.Easing.Back.Out);
                tween.start();
                this.stage.addChild(this.soundButton);

                var tween = new game.Tween(this.twitterButton.scale)
                    .to({ x: 1.5, y: 1.5 }, 200)
                    .easing(game.Tween.Easing.Back.Out);
                tween.start();
                this.stage.addChild(this.twitterButton);

                var tween = new game.Tween(this.facebookButton.scale)
                    .to({ x: 1.5, y: 1.5 }, 200)
                    .easing(game.Tween.Easing.Back.Out);
                tween.start();
                this.stage.addChild(this.facebookButton);

            },

            gameOver: function () {
                var i;
                this.cloudSpeedFactor = 0.2;
                this.ended = true;
                this.timers.length = 0;
                for (i = 0; i < this.objects.length; i++) {
                    if (this.objects[i].speed) this.objects[i].speed.x = 0;
                }
                for (i = 0; i < this.world.bodies.length; i++) {
                    this.world.bodies[i].velocity.set(0, 0);
                }

                this.addTimer(500, this.showScore.bind(this));

                game.audio.stopMusic();
                if (parseInt(game.storage.get('sound')) === 1) {
                    game.audio.playSound('explosion');
                }




            }
        });

    });