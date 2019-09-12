class Wave1 extends Phaser.Scene
{
    constructor(){
        super({key:"LoadSprite"});
    }
    preload()
    {
       
        //this.load.image('baseplatform','../Assets/baseplatform.png');
        this.load.image('background', '../Assets/background.png')
        this.load.image('platform','../Assets/platform1.png');
        this.load.image('enemy','../Assets/enemy.png');
        this.load.image('pong','../Assets/pong.png');
        this.load.spritesheet('player','../Assets/Play.png',{frameWidth:90,frameHeight:85});
        this.load.spritesheet('playerfly','../Assets/player_fly.png',{frameWidth:90,frameHeight:70});
        this.load.image('egg', '../Assets/egg.png')
        this.load.image('pterodactyl', '../Assets/pika.png');
    }
    create()
    {
        //reAL DIMENSIONs with .55 scale player, .75 scale enemy
        //55.5 x 35.25 Enemy
        //49.5 x 46.75 Player

        this.time.addEvent({ delay: 10000, callback: this.pterodactylSpawn, callbackScope: this, repeat: 0, startAt: 0 });
        var background = this.add.image(256*1.75, 192*1.6, 'background');
        background.setScale(1.75, 1.6);

        let score=0;
        let scoreText;
        let gameOverText;
        let isGameover = false;
        let playerHeight=85;
        let playerWidth=90;
        let playerScale=0.55;
        this.platforms = this.physics.add.staticGroup();
        this.cursors = this.input.keyboard.createCursorKeys();
        let isHitting = false;
        //Pong
        this.pong= this.physics.add.sprite(400,600-9.5,'pong');
        this.pong.setCollideWorldBounds(true);
        //this.platforms.create(350, 568, 'baseplatform').setScale(2).refreshBody();
        this.platforms.create(100, 150, 'platform');
        //this.platforms.create(400, 300, 'platform');
        //this.platforms.create(700, 150, 'platform');
        this.platforms.create(700, 400, 'platform');
        //this.platforms.create(100, 400, 'platform');
        //Player
        this.player = this.physics.add.sprite(400,600-9.5-32,'player');
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
        this.anims.create({
            key: 'fly',
            frames: this.anims.generateFrameNumbers('playerfly', { start: 0, end: 4 }),
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
        
        this.pterodactyls = this.physics.add.group({
            key: 'pterodactyl'
        });

        this.enemies.children.iterate(function (child) { //sets initial position, velocity
            var z = Math.floor(Math.random() * 2);
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

        this.pterodactyls.children.iterate(function (child) { //sets initial position, velocity
            child.setScale(.5);
            child.setCollideWorldBounds(true);
            child.setBounce(1,0);    
            child.disableBody(true, true);      
            child.setState('notSpawned'); 
            child.body.setAllowGravity(false);
        }, this);

        this.physics.add.collider(this.enemies,this.platforms, hitPlatformEnemy,null, this);
        this.physics.add.collider(this.player,this.enemies,CheckCollision,null,this);
        this.physics.add.collider(this.player,this.platforms, hitPlatform, null, this);
        this.physics.add.collider(this.player,this.eggs, hitEgg, null, this);
        this.physics.add.collider(this.eggs,this.platforms);
        this.physics.add.collider(this.enemies,this.enemies);
        this.physics.add.overlap(this.player, this.pterodactyls, checkCollisionPterodactyl, null, this);
        //this.physics.add.overlap(this.player,this.enemies,CheckCollision,null,this);

        scoreText = this.add.text(20,20,'Score:0',{ fontSize: '32px', fill: '#ffffff' });
        function hitEgg(player, egg) {
            egg.disableBody(true,true);
            score += 1;
            scoreText.setText('Score: ' + score);
        }
        function CheckCollision(player,enemy)
        {
           // console.log(player.y+24,enemy.y);
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

        function checkCollisionPterodactyl(){
            this.GameOver();
        }

        if(isGameover)
        {
           this.enemies.remove(true);
        }
        function hitPlatform() {
            if(this.player.body.touching.down && !this.player.body.touching.left && !this.player.body.touching.right) { //Collisions with just the bottom of the player don't cause y bounce
                
            this.player.play('turn',true);
            isHitting= true;
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
            this.player.anims.play('fly',true);
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
       
        
        this.Key_Z=  this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z)
        this.Key_C=  this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.C)
        if(this.Key_Z.isDown && (this.player.body.touching.down || whenJumpPressed))
        {
            this.player.setFlipX(true);
            if(this.player.body.velocity.x > -180 && this.player.body.velocity.x <= 0){
                this.player.setVelocityX(this.player.body.velocity.x-5);
            } else if (this.player.body.velocity.x > 0){
                this.player.setVelocityX(this.player.body.velocity.x-10);
            }
            if(this.isHitting)
            {
                this.player.anims.play('right',true);
            }
            else{
                this.player.anims.play('fly',true);
            }

            
        }
        if(this.Key_C.isDown && (this.player.body.touching.down || whenJumpPressed))
        {
            this.player.setFlipX(false);
            if(this.player.body.velocity.x < 180 && this.player.body.velocity.x >= 0){
                this.player.setVelocityX(this.player.body.velocity.x+5);
            } else if (this.player.body.velocity.x < 0){
                this.player.setVelocityX(this.player.body.velocity.x+10);
            }
            if(this.isHitting)
            {
                this.player.anims.play('right',true);
            }
            else{
                this.player.anims.play('fly',true);
            }

            
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

    eggMove(){
        var i = 0;
        this.eggs.children.iterate(function (child) {
            var correspondingEnemy = this.enemies.children.getArray()[i];
            if(correspondingEnemy.active){
                child.setPosition(correspondingEnemy.x, correspondingEnemy.y);
                child.setVelocity(correspondingEnemy.body.velocity.x + correspondingEnemy.y/10, correspondingEnemy.body.velocity.y);

            } else {
                if(child.state === 'invis') {
                    child.enableBody(false, child.x, child.y, true, true);
                    child.setState('vis');
                }
            }
            
            i++;
            
        }, this);
    }
        movePong()
    {
        
        if (this.cursors.left.isDown)
        {
            this.pong.body.velocity.x+=-10;
        }
     
        if (this.cursors.right.isDown )
        {
            this.pong.body.velocity.x+=10;
        }

    }

    pterodactylSpawn(){
        this.pterodactyls.children.iterate(function (child) {
            child.setState('spawned');
            child.enableBody(true, 700, 300, true, true);
            child.setVelocity(70, 45);
        }, this);
    }

    pterodactylMove(){
        this.pterodactyls.children.iterate(function (child) {
            if(child.state === 'spawned'){
                var z = Math.floor(Math.random() * 400);
                if(z === 0) {
                    child.setVelocity(Math.floor(Math.random() * 50) + 20, Math.floor(Math.random() * 50) + 20);
                    if(child.x < this.player.x) { //enemy to the left
                        if(child.body.velocity.x < 0) {
                            child.body.velocity.x *= -1;
                        }
                    } else { //enemy to the right
                        if(child.body.velocity.x > 0) {
                            child.body.velocity.x *= -1;
                        }
                    }

                    if(child.y < this.player.y) { //enemy below
                        if(child.body.velocity.y < 0) {
                            child.body.velocity.y *= -1;
                        }
                    } else { //enemy to the right
                        if(child.body.velocity.y > 0) {
                            child.body.velocity.y *= -1;
                        }
                    }
                    
                    //child.body.setVelocity(child.x - this.player.x, child.x - this.player.x);
                    //child.body.setVelocity(child.body.velocity.x - this.player.body.velocity.x, child.body.velocity.y);
                    //child.rotation = Phaser.Math.Angle.Between(child.x, child.y, this.player.x, this.player.y);
                }
            }
            if(child.body.velocity.x > 60){child.body.velocity.x = 60;}
            if(child.body.velocity.y > 60){child.body.velocity.y = 60;}
            if(child.body.velocity.x < -60){child.body.velocity.x = -60;}
            if(child.body.velocity.y < -60){child.body.velocity.y = -60;}

        }, this);
    }
    update()
    {
        
       this.move(false);
       this.enemyMove();
       this.eggMove();
        this.movePong();
       console.log(this.player.displayHeight/2+this.player.y)
        if(this.player.displayHeight/2+this.player.y>=600){this.GameOver()}
       this.pterodactylMove();
        //else
        //{
            //this.player.anims.play('turn');
        //}
       
    }
    
}
