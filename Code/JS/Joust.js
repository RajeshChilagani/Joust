var config = {
    type: Phaser.AUTO,
    width: 1440,
    height: 1080,
    physics: 
    {
        default: 'arcade',
        arcade: 
        {
            gravity: 
            {
                y: 200
            }
        }

    },
    scene: [TestLevel]
};

var game = new Phaser.Game(config);