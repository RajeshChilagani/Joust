class Wave1 extends Phaser.Scene
{
    constructor(){
        super({key:"LoadSprite"});
    }
    preload()
    {
       
        //this.load.image('baseplatform','../Assets/baseplatform.png');
        this.load.image('platform','../Assets/platform1.png');
        this.load.image('enemy','../Assets/enemy.png');
        this.load.image('pong','../Assets/pong.png');
        this.load.spritesheet('player','../Assets/Play.png',{frameWidth:90,frameHeight:85});
        this.load.image('egg', '../Assets/egg.png')
    }
    create()
    {
        //reAL DIMENSIONs with .55 scale player, .75 scale enemy
        //55.5 x 35.25 Enemy
        //49.5 x 46.75 Player
        let score=0;
        let scoreText;
        let gameOverText;
        let isGameover = false;
        let playerHeight=85;
        let playerWidth=90;
        let playerScale=0.55;
        this.platforms = this.physics.add.staticGroup();
        this.cursors = this.input.keyboard.createCursorKeys();
        //Pong
        this.pong= this.physics.add.sprite(400,550,'pong');
        this.pong.setBounce(1,.7);
        this.pong.setCollideWorldBounds(true);
        //this.platforms.create(350, 568, 'baseplatform').setScale(2).refreshBody();
        this.platforms.create(100, 150, 'platform');
        //this.platforms.create(400, 300, 'platform');
        //this.platforms.create(700, 150, 'platform');
        this.platforms.create(700, 400, 'platform');
        //this.platforms.create(100, 400, 'platform');
        //Player
        this.player = this.physics.add.sprite(400,450,'player');
        this.player.setScale(playerScale);
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
       this.physics.add.collider(this.player,this.pong);

       this.enemies = this.physics.add.group({
            key: 'enemy',
            repeat: 3,
        });

        this.eggs = this.physics.add.group({
            key: 'egg',
            repeat: 3,
        });
        
        this.enemies.children.iterate(function (child) { //sets initial position, velocity
            var z = Math.floor(Math.random() * 1) + 1;
            child.setX(this.platforms.children.getArray()[z].body.x + 70); //70 hard code for center right now
            child.setY(this.platforms.children.getArray()[z].body.y - 20); //20 so above
            if(Math.random() < .5) {child.setVelocityX(50);}
            else {child.setVelocityX(-50);}
            child.setCollideWorldBounds(true);
            child.setBounce(1,0);
            child.setScale(.75);
        }, this);

        this.eggs.children.iterate(function (child) { //sets initial position, velocity
            child.setScale(.3);
            child.setCollideWorldBounds(true);
            child.setBounce(.6,.6);
            child.setDrag(3);
            child.setState('invis');
            child.disableBody(true, true);
            
        }, this);

        this.physics.add.collider(this.enemies,this.platforms, hitPlatformEnemy,null, this);
        this.physics.add.collider(this.player,this.enemies,CheckCollision,null,this);
        this.physics.add.collider(this.player,this.platforms, hitPlatform, null, this);
        this.physics.add.collider(this.player,this.eggs, hitEgg, null, this);
        this.physics.add.collider(this.eggs,this.platforms);
        this.physics.add.collider(this.enemies,this.enemies);
        //this.physics.add.overlap(this.player,this.enemies,CheckCollision,null,this);

        scoreText = this.add.text(20,20,'Score:0',{ fontSize: '32px', fill: '#ffffff' });
        function hitEgg(player, egg) {
            egg.disableBody(true,true);
            score += 1;
            scoreText.setText('Score: ' + score);
        }
        function CheckCollision(player,enemy)
        {
            console.log(player.y+24,enemy.y);
           if(player.y+playerHeight*playerScale-5<enemy.y)
           {
               enemy.disableBody(true,true);
               score+=1;
               scoreText.setText('Score: ' + score);
           }
           if(player.y+playerHeight*playerScale-5>enemy.y)
           {  
                this.GameOver();

           }
        }
        if(isGameover)
        {
           this.enemies.remove(true);
        }
        function hitPlatform() {
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
    GameOver()
    {
       
        this.player.disableBody(true,true);
        this.enemies.children.iterate(function (child) { //sets initial position, velocity
            child.disableBody(true,true);
        }, this);
        this.isGameover=true; 
        this.scoreText = this.add.text(300,250,'GameOver',{ fontSize: '50Px', fill: '#ffffff' });
        this.pong.disableBody(true,true);
    }
    move(whenJumpPressed){ //player movement
       
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