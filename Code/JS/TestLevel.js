var character;
class TestLevel extends Phaser.Scene{

    constructor(){
        super({key:"TestLevel"});
    }
    preload(){
        this.load.image("pika", "../Assets/pika.png");
        this.load.image("floor", "../Assets/background_groundfloor.png");
          
    }
    create(){
        this.floor = this.physics.add.image(200,500, "floor");
        this.floor.body.setAllowGravity(false);
        this.floor.setImmovable(true);
        character = this.physics.add.sprite(300,0,"pika"); 
        this.input.keyboard.on("keyup_X", function(event){
            character.setVelocity(character.body.velocity.x, character.body.velocity.y - 100);
        }, this);

        this.physics.add.collider(character, this.floor);
    }
    update(delta){
        //if(character.body.onFloor()) {
        //   character.setVelocity(character.body.velocity.x, -10);
        //}
    }
}