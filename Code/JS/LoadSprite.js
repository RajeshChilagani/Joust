class LoadSprite extends Phaser.Scene
{
    preload()
    {
       // this.load.image('TEST','../Assets/pika.png');
        this.load.image('Wall','../Assets/Wall.jpg')
    }
    create()
    {
        //this.image = this.add.image(400,300,'TEST');
        this.image = this.add.image(0,0,'Wall');
    }
}