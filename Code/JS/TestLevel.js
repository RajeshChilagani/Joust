var character;
class TestLevel extends Phaser.Scene{

    constructor(){
        super({key:"TestLevel"});
    }
    preload(){
        this.load.image("pika", "../Assets/pika.png");
          
    }
    create(){
        character = this.physics.add.image(300,0,"pika"); 
    }
    update(delta){
        if(character.y > 500) {
            character.setVelocity(character.getVelocity().x, -1);
        }
    }
}