game.module(
    'game.assets'
)
    .require(
        'engine.audio'
    )
    .body(function () {

        // Sprites
        game.addAsset('media/player1.png');
        game.addAsset('media/player2.png');
        game.addAsset('media/logo2.png');
        game.addAsset('media/logo1.png');
        game.addAsset('media/cloud4.png');
        game.addAsset('media/cloud3.png');
        game.addAsset('media/cloud2.png');
        game.addAsset('media/cloud1.png');
        game.addAsset('media/ground.png');
        game.addAsset('media/bushes.png');
        game.addAsset('media/parallax3.png');
        game.addAsset('media/parallax2.png');
        game.addAsset('media/parallax1.png');
        game.addAsset('media/particle.png');
        game.addAsset('media/particle2.png');
        game.addAsset('media/bar.png');
        game.addAsset('media/gameover.png');
        game.addAsset('media/gameover1.png');
        game.addAsset('media/gameover2.png');
        game.addAsset('media/gameover3.png');
        game.addAsset('media/gameover4.png');
        game.addAsset('media/new.png');
        game.addAsset('media/restart.png');
        game.addAsset('media/tap1.png');
        game.addAsset('media/tap2.png');
        game.addAsset('media/sound.png');
        game.addAsset('media/no-sound.png');
        game.addAsset('media/facebook.png');
        game.addAsset('media/twitter.png');

        game.addAsset('media/door.png');

        // Font
        game.addAsset('media/font.fnt');

        // Sounds
        game.addAudio('media/sound/explosion.m4a', 'explosion');
        game.addAudio('media/sound/jump.m4a', 'jump');
        game.addAudio('media/sound/score.m4a', 'score');
        game.addAudio('media/sound/highscore.m4a', 'highscore');
        game.addAudio('media/sound/music.m4a', 'music');


        game.Loader.inject({
            backgroundColor: 0xaa3702,

            initStage: function () {
                var sprite = new game.MovieClip([
                    game.Texture.fromImage('media/player1.png'),
                    game.Texture.fromImage('media/player2.png')
                ]);
                sprite.position.x = (game.system.width / 2);
                sprite.position.y = (game.system.height / 2) - 100;
                sprite.anchor.x = 0.5;
                sprite.anchor.y = 0.5;
                sprite.animationSpeed = 0.1;
                sprite.play();
                game.system.stage.addChild(sprite);


                this.bar = new game.Graphics();
                this.bar.beginFill(0xffffff);
                this.bar.drawRect(0, 0, 260, 40);

                this.bar.position.x = game.system.width / 2 - (260 / 2);
                this.bar.position.y = game.system.height / 2 - (40 / 2);

                this.bar.scale.x = this.percent / 100;

                game.system.stage.addChild(this.bar);
            },

            onPercentChange: function () {
                this.bar.scale.x = this.percent / 100;
            }
        });

    });