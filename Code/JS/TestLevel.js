var character;
class TestLevel extends Phaser.Scene{

    constructor(){
        super({key:"TestLevel"});
    }
    preload(){
        this.load.image("pika", "../Assets/pika.png");
          
    }
    create(){
        character = this.physics.add.sprite(300,0,"pika"); 
        this.input.keyboard.on("keyup_X", function(event){
            character.setVelocity(character.body.velocity.x, character.body.velocity.y - 100);
        }, this);
    }
    update(delta){
        if(character.y > 500) {
            character.setVelocity(character.body.velocity.x, -1);
        }
    }
}