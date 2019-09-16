class EndScreen extends Phaser.Scene
{
    constructor()
    {
        super({key:"EndScreen"});
        
    }
    preload()
    {
        this.load.image('Gameover', '../Assets/Gameover.png')
    }
    create()
    {
        this.GameoverImg=this.add.image(400,350,'Gameover');
        this.GameoverImg.setScale(1.6);
    }

}