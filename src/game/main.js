game.module(
    'game.main'
)
    .require(
        'engine.core',
        'engine.physics',
        'engine.particle',
        'game.assets',
        'game.objects',
        'game.scenes'
    )
    .body(function () {
        game.System.idtkScale = 'ScaleToFill';
        game.start(SceneGame);
    });


