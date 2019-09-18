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
        this.introText = this.add.text(250,300,'Press Enter to start game');
        this.introText.setFontSize("24px");
        this.introText.setFontFamily("Saira Stencil One");
        this.introText.setFill("#34F1B1"),
        this.introText.setStroke("#BF136E",5),
        this.input.keyboard.on('keyup',function(e){
            if(e.key=='Enter')
            {
                this.scene.start('Wave1');
            }

        },this)
    }

}