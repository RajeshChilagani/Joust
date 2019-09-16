class Intro extends Phaser.Scene
{
    constructor()
    {
        super({key:"Intro"});
        
    }
    preload()
    {
        this.load.image('Intro', '../Assets/Intro.png')
    }
    create()
    {
        let introText
        this.Intro = this.add.image(400,300,'Intro');
        this.introText = this.add.text(250,300,'Press Enter to start game',{ fontSize: '32px', fontFamily: '"AgencyFB"' ,fill: '#ffffff' });
        this.input.keyboard.on('keyup',function(e){
            if(e.key=='Enter')
            {
                this.scene.start('Wave1');
            }

        },this)
    }

}