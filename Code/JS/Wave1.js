class Wave1 extends Phaser.Scene
{
    constructor(){
        super({key:"LoadSprite"});
    }
    preload()
    {
       
        this.load.image('baseplatform','../Assets/baseplatform.png');
        this.load.image('platform','../Assets/platform1.png');
        this.load.image('enemy','../Assets/star.png');
        this.load.spritesheet('player','../Assets/Play.png',{frameWidth:90,frameHeight:85});
    }
    create()
    {
        let score=0;
        let scoreText;
        let gameOverText;
        let isGameover = false;
        this.platforms = this.physics.add.staticGroup();
        this.platforms.create(350, 568, 'baseplatform').setScale(2).refreshBody();
        this.platforms.create(100, 150, 'platform');
        this.platforms.create(400, 300, 'platform');
        this.platforms.create(700, 150, 'platform');
        this.platforms.create(700, 400, 'platform');
        this.platforms.create(100, 400, 'platform');
        //Player
        this.player = this.physics.add.sprite(100,450,'player');
        this.player.setScale(0.555);
        this.player.setBounce(1,.7);
        this.player.setCollideWorldBounds(true);
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('player', { start: 0, end: 8 }),
            frameRate: 16,
            repeat: -1
        });
        
         this.anims.create({
          key: 'turn',
            frames: [ { key: 'player', frame: 4 } ],
             frameRate: 20
        });
        
        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('player', { start: 0, end: 8 }),
            frameRate: 16,
            repeat: -1
        });
        this.physics.add.collider(this.player,this.platforms, hitPlatform, null, this);
       

       this.enemies = this.physics.add.group({
            key: 'enemy',
            repeat: 3,
        });
        
        this.enemies.children.iterate(function (child) { //sets initial position, velocity
            var z = Math.floor(Math.random() * 5) + 1;
            child.setX(this.platforms.children.getArray()[z].body.x + 70); //70 hard code for center right now
            child.setY(this.platforms.children.getArray()[z].body.y - 20); //20 so above
            if(Math.random() < .5) {child.setVelocityX(50);}
            else {child.setVelocityX(-50);}
            child.setCollideWorldBounds(true);
            child.setBounce(1,0);
        }, this);
        this.physics.add.collider(this.enemies,this.platforms, hitPlatformEnemy,null, this);
        this.physics.add.collider(this.player,this.enemies,CheckCollision,null,this);
        //this.physics.add.overlap(this.player,this.enemies,CheckCollision,null,this);

        scoreText = this.add.text(20,20,'Score:0',{ fontSize: '32px', fill: '#ffffff' });

        function CheckCollision(player,enemy)
        {
            console.log(player.y+24,enemy.y);
           if(player.y+24<enemy.y)
           {
               enemy.disableBody(true,true);
               score+=1;
               scoreText.setText('Score: ' + score);
           }
           if(player.y+24>enemy.y)
           {
               player.disableBody(true,true);
               isGameover=true;
               scoreText = this.add.text(300,250,'GameOver',{ fontSize: '50Px', fill: '#ffffff' });


           }
        }
        console.log(isGameover);
        if(isGameover)
        {
           this.enemies.remove(true);
        }
        function hitPlatform(character, floor) {
            if(this.player.body.touching.down && !this.player.body.touching.left && !this.player.body.touching.right) { //Collisions with just the bottom of the player don't cause y bounce
                this.player.body.setVelocity(this.player.body.velocity.x,0);
            }
        }

        function hitPlatformEnemy(e, floor) {
            if(e.body.touching.down && !e.body.touching.left && !e.body.touching.right) { //Collisions with just the bottom of the player don't cause y bounce
                e.body.setVelocity(e.body.velocity.x,0);
            }
        }
     
        this.input.keyboard.on("keyup_X", function(event){
            this.player.setVelocity(this.player.body.velocity.x, this.player.body.velocity.y - 70);
            this.move(true);
        }, this); 
        this.input.keyboard.on("keyup_R", function(event){
            isGameover=false;
            this.player.disableBody(false,false);
        }, this); 
        
    }

    move(whenJumpPressed){ //player movement
        this.cursors = this.input.keyboard.createCursorKeys();
        if (this.cursors.left.isDown && (this.player.body.touching.down || whenJumpPressed))
        {
            this.player.setFlipX(true);
            if(this.player.body.velocity.x > -180 && this.player.body.velocity.x <= 0){
                this.player.setVelocityX(this.player.body.velocity.x-5);
            } else if (this.player.body.velocity.x > 0){
                this.player.setVelocityX(this.player.body.velocity.x-10);
            }

            this.player.anims.play('left', true);
        }
        if (this.cursors.right.isDown && (this.player.body.touching.down || whenJumpPressed))
        {
            this.player.setFlipX(false);
            if(this.player.body.velocity.x < 180 && this.player.body.velocity.x >= 0){
                this.player.setVelocityX(this.player.body.velocity.x+5);
            } else if (this.player.body.velocity.x < 0){
                this.player.setVelocityX(this.player.body.velocity.x+10);
            }
            

            this.player.anims.play('right', true);
        }
        if(this.player.body.velocity.y > 250) {this.player.setVelocityY(250);}
        if(this.player.body.velocity.y < -250) {this.player.setVelocityY(-250);}
    }       

    enemyMove(){ //enemy random jumping
        this.enemies.children.iterate(function (child) {
            var z = Math.floor(Math.random() * 15);
            if(z === 1){
                child.setVelocity(child.body.velocity.x, child.body.velocity.y - 50);
            }
            if(child.body.velocity.y < - 150) {
                child.setVelocityY(-150);
            } else if(child.body.velocity.y > 150) {
                child.setVelocityY(150);
            }
        }, this);
    }
    update()
    {
       this.move(false);
       this.enemyMove();
        //else
        //{
            //this.player.anims.play('turn');
        //}
       
    }
    
}