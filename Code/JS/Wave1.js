var timerEvents = [];
class Wave1 extends Phaser.Scene
{
    
    constructor(){
        super({key:"LoadSprite"});
        this.IsTouching=true;
        this.IsOnground=true;
        this.playerSpriteDirection="right"
        this.playerLives=5
        this.playerLivesText
        this.IsPlayerImmune=true;
        this.isAnyKeypressed=false;
        this.UIScale=1;
        this.scoreText
        this.score=0
        this.isGameover=false
    }
    preload()
    {
       
        //this.load.image('baseplatform','../Assets/baseplatform.png');
        this.load.image('background', '../Assets/background.png')
        this.load.image('platform','../Assets/platform1.png');
        this.load.image('enemy','../Assets/enemy.png');
        this.load.image('pong','../Assets/pong_new.png');
        this.load.spritesheet('player','../Assets/Play.png',{frameWidth:90,frameHeight:85});
        this.load.spritesheet('playerfly','../Assets/fly.png',{frameWidth:90,frameHeight:85});
        this.load.spritesheet('eggShake','../Assets/egg_shake.png',{frameWidth:256/4,frameHeight:70});
        this.load.spritesheet('eggHatch','../Assets/egg_hatch.png',{frameWidth:256/4,frameHeight:70});
        this.load.spritesheet('enemyFly','../Assets/enemy_fly.png',{frameWidth:60,frameHeight:55});
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

      
        let playerHeight=85;
        let playerWidth=90;
        let playerScale=0.55;
        this.platforms = this.physics.add.staticGroup();
        this.cursors = this.input.keyboard.createCursorKeys();

    

    //Pong
        this.pong= this.physics.add.sprite(400,600-16,'pong');
        this.pong.setCollideWorldBounds(true);
        this.pong.setScale(this.UIScale);

    //UI
    
        this.scoreText = this.add.text(this.pong.getCenter().x,this.pong.getCenter().y-75/1.6,this.score,{ fontSize: '32px', fontFamily: '"Roboto Condensed"' ,fill: '#FF8833' });
        this.playerLivesText = this.add.text(this.pong.getCenter().x,this.pong.getCenter().y-75/1.6,this.playerLives,{ fontSize: '32px', fontFamily: '"Roboto Condensed"' ,fill: '#FF8833' });
    //Platforms
        //this.platforms.create(350, 568, 'baseplatform').setScale(2).refreshBody();
        this.platforms.create(100, 150, 'platform');
        //this.platforms.create(400, 300, 'platform');
        this.platforms.create(700, 150, 'platform');
        this.platforms.create(700, 400, 'platform');
        this.platforms.create(100, 400, 'platform');

    //Player
    
        this.player = this.physics.add.sprite(400,600-this.pong.displayHeight-(playerHeight/2)*playerScale,'player');
        this.player.setScale(playerScale);
        this.player.setCollideWorldBounds(true);
        this.player.setBounce(1.2,.7);
        
    //Enemies & Eggs
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
            /*var z = Math.floor(Math.random() * 4);
            child.setX(this.platforms.children.getArray()[z].body.x + 70); //70 hard code for center right now
            child.setY(this.platforms.children.getArray()[z].body.y - 20); //20 so above
            if(Math.random() < .5) {child.setVelocityX(50);}
            else {child.setVelocityX(-50);}
            child.setCollideWorldBounds(true);
            child.setBounce(1,0);
            child.setScale(.75);*/
            timerEvents.push(this.time.addEvent({ delay: 1000*this.enemies.children.getArray().indexOf(child), callback: this.spawnEnemy, callbackScope: this, args: [child]}));
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

    //Animations
        this.anims.create({
            key: 'run',
            frames: this.anims.generateFrameNumbers('player', { start: 0, end: 8 }),
            frameRate: 16,
            repeat: -1
        });
        
         this.anims.create({
          key: 'idle',
            frames: [ { key: 'player', frame: 4 } ],
             frameRate: 20
        });

        this.anims.create({
            key: 'fly',
            frames: this.anims.generateFrameNumbers('playerfly', { start: 0, end: 4 }),
            frameRate: 16,
            repeat: -1,
            scale: .7
        });

        this.anims.create({
            key: 'eggShake',
            frames: this.anims.generateFrameNumbers('eggShake', { start: 0, end: 3 }),
            frameRate: 16,
            repeat: -1
        });
           
        this.anims.create({
            key: 'eggHatch',
            frames: this.anims.generateFrameNumbers('eggHatch', { start: 0, end: 3 }),
            frameRate: 1,
            repeat: 0
        });

        this.anims.create({
            key: 'enemyFly',
            frames: this.anims.generateFrameNumbers('enemyFly', { start: 0, end: 3 }),
            frameRate: 16,
            repeat: -1
        });


    //Colliders
        this.physics.add.collider(this.player,this.platforms, hitPlatform, null, this);
        this.physics.add.collider(this.player,this.pong,hitPong,null,this);
        this.physics.add.collider(this.enemies,this.pong);
        this.physics.add.collider(this.eggs,this.pong);
        this.physics.add.collider(this.enemies,this.platforms, hitPlatformEnemy,null, this);
        this.physics.add.collider(this.player,this.enemies,CheckCollision,null,this);
        this.physics.add.collider(this.player,this.platforms, hitPlatform, null, this);
        this.physics.add.overlap(this.player,this.eggs, hitEgg, null, this);
        this.physics.add.collider(this.eggs,this.platforms);
        this.physics.add.collider(this.enemies,this.enemies);
        this.physics.add.collider(this.pterodactyls,this.platforms);
        this.physics.add.collider(this.pterodactyls,this.pong);
        this.physics.add.overlap(this.player, this.pterodactyls, checkCollisionPterodactyl, null, this);
        //this.physics.add.overlap(this.player,this.enemies,CheckCollision,null,this);
        function hitEgg(player, egg) {
            egg.disableBody(true,true);
            this.score += 1;
            this.scoreText.setText(this.score);
        }
        function CheckCollision(player,enemy)
        {
           // console.log(player.y+24,enemy.y);
           if(player.getCenter().y < enemy.getCenter().y)
           {
            enemy.disableBody(true,true);
            this.score+=1;
            this.scoreText.setText(this.score);
           } 
           else if(this.IsPlayerImmune==false) 
           {
            this.Lives();
           }
           /*if(player.y+playerHeight*playerScale-5<enemy.y)
           {
               enemy.disableBody(true,true);
               score+=1;
               scoreText.setText('Score: ' + score);
           }
           if(player.y+player.displayHeight*playerScale-5>enemy.y)
           {  
                this.GameOver();
           }*/
        }

        function checkCollisionPterodactyl(player, pterodactyl){
            if(this.IsPlayerImmune==false)
            {
                if(Math.abs(this.player.body.velocity.x) + Math.abs(this.player.body.velocity.y) > 500){
                    pterodactyl.disableBody(true,true);
                    this.score+=3;
                    this.scoreText.setText(this.score);
                } else {
                    this.Lives();
                }
            }

        }

        function hitPlatform() {
            if(this.player.body.touching.down && !this.player.body.touching.left && !this.player.body.touching.right) { //Collisions with just the bottom of the player don't cause y bounce   
            this.playAnim()
            this.IsTouching=true;
            this.player.body.setVelocity(this.player.body.velocity.x,0);
            }
        }

        function hitPlatformEnemy(e, floor) {
            if(e.body.touching.down && !e.body.touching.left && !e.body.touching.right) { //Collisions with just the bottom of the player don't cause y bounce
                e.body.setVelocity(e.body.velocity.x,0);
            }
        }  
        function hitPong() {
            
            this.playAnim()
            if(this.player.body.touching.down) { //Collisions with just the bottom of the player don't cause y bounce   
            this.IsTouching=true;
            this.player.body.setVelocity(this.player.body.velocity.x,this.player.body.velocity.y);
            }
        }

        
     
        this.input.keyboard.on("keyup_X", function(event){
            this.player.setVelocity(this.player.body.velocity.x, this.player.body.velocity.y -70);
            this.IsTouching=false;
            this.playAnim()
            this.IsOnground=false;
            this.isAnyKeypressed==true
            this.IsPlayerImmune=false
            this.move(true);
        }, this); 
        this.input.keyboard.on("keyup_R", function(event){
           
            this.player.disableBody(false,false);
        }, this);
        
    }
    playAnim()
    {
         if(this.playerSpriteDirection=='left')
         {
             this.player.setFlipX(true)     
         }
         else
         {
             this.player.setFlipX(false);
         }
        if(this.player.body.velocity.x==0)
        {
            this.player.anims.play('idle',true)
        }
        if(this.player.body.velocity.x>0 || this.player.body.velocity.x<0||this.player.body.velocity.y>0 || this.player.body.velocity.y<0)
        {
            if(this.IsTouching)
            {
                this.player.anims.play('run',true)
            }
            else
            {
                this.player.anims.play('fly',true)
            }
            
        }
    }
    GameOver()
    {
       
        this.player.disableBody(true,true);
        this.enemies.children.iterate(function (child) { //sets initial position, velocity
            child.disableBody(true,true);
        }, this);
        this.isGameover=true; 
        //this.scoreText = this.add.text(300,250,'GameOver',{ fontSize: '50Px', fill: '#ffffff' });
        this.pong.disableBody(true,true);
    }
    move(whenJumpPressed){ //player movement
       
        if (this.cursors.left.isDown && (this.player.body.touching.down || whenJumpPressed))
        {
            this.IsPlayerImmune=false
            this.isAnyKeypressed==true
            this.player.setFlipX(true);
            this.playerSpriteDirection='left';
            if(this.player.body.velocity.x > -180 && this.player.body.velocity.x <= 0){
                if(whenJumpPressed){
                    this.player.setVelocityX(this.player.body.velocity.x-4);
                } else {
                    this.player.setVelocityX(this.player.body.velocity.x-2);
                }
            } else if (this.player.body.velocity.x > 0){
                if(whenJumpPressed){
                    this.player.setVelocityX(this.player.body.velocity.x-10);
                } else {
                    this.player.setVelocityX(this.player.body.velocity.x-5);
                }
            }
            this.playAnim()
        }
        if(this.cursors.right.isDown && (this.player.body.touching.down || whenJumpPressed))
        {
            this.IsPlayerImmune=false
            this.isAnyKeypressed==true
            this.player.setFlipX(false);
            this.playerSpriteDirection='right';
            if(this.player.body.velocity.x < 180 && this.player.body.velocity.x >= 0){
                if(whenJumpPressed){
                    this.player.setVelocityX(this.player.body.velocity.x+4);
                } else {
                    this.player.setVelocityX(this.player.body.velocity.x+2);
                }
            } else if (this.player.body.velocity.x < 0){
                if(whenJumpPressed){
                    this.player.setVelocityX(this.player.body.velocity.x+10);
                } else {
                    this.player.setVelocityX(this.player.body.velocity.x+5);
                }
            }
            this.playAnim()

            
        }
        if(this.player.body.velocity.y > 250) {this.player.setVelocityY(250);}
        if(this.player.body.velocity.y < -250) {this.player.setVelocityY(-250);}
        if(this.player.body.velocity.x > 750) {this.player.setVelocityX(750);}
        if(this.player.body.velocity.x < -750) {this.player.setVelocityX(-750);}
    }       

    enemyMove(){ //enemy random jumping
        this.enemies.children.iterate(function (child) {
            child.anims.play('enemyFly', true);
            var z = Math.floor(Math.random() * 13);
            if(z === 1){
                child.setVelocity(child.body.velocity.x, child.body.velocity.y - 50);
            }
            if(child.body.velocity.y < - 150) {
                child.setVelocityY(-150);
            } else if(child.body.velocity.y > 150) {
                child.setVelocityY(150);
            }
            if(child.body.velocity.x > 0) {
                child.setFlipX(false);
            } else {
                child.setFlipX(true);
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
                    console.log("TIMETIMEITMIEEMTE    " + this.time.now);
                    timerEvents.push(this.time.addEvent({ delay: 4000, callback: this.preactivation, callbackScope: this, args: [correspondingEnemy, child]}));
                    child.anims.play('eggShake'); 
                   // var timedEvent = this.time.delayedCall(this.time.now+3000, this.activateEnemy(correspondingEnemy), [], this);//correspondingEnemy.active
                }
            }
            
            i++;
            
        }, this);
    }
    preactivation(correspondingEnemy, child){ //if you have any better implemenentations I'm all ears
        child.anims.play('eggHatch'); 
        timerEvents.push(this.time.addEvent({ delay: 4000, callback: this.activateEnemy, args: [correspondingEnemy, child]}));
    }
    activateEnemy(correspondingEnemy,child) {
        if(child.active){
            correspondingEnemy.enableBody(true, child.x, child.y, true, true);
            if(Math.random() < .5) {correspondingEnemy.setVelocityX(50);}
            else {correspondingEnemy.setVelocityX(-50);}
            child.disableBody(true, true);
        }
    }

    movePong()
    {
        this.Key_Z=  this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z)
        this.Key_C=  this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.C)
        if (this.Key_Z.isDown)
        {
            this.IsPlayerImmune=false
            this.isAnyKeypressed==true
            this.pong.body.velocity.x+=-10;
        }
     
        else if (this.Key_C.isDown )
        {
            this.IsPlayerImmune=false
            this.isAnyKeypressed==true
            this.pong.body.velocity.x+=10;
        }
        else
        {
            this.pong.body.velocity.x=0;
        }
        this.scoreText.setPosition(this.pong.getCenter().x-476/5,this.pong.getCenter().y-75/3);
        this.playerLivesText.setPosition(this.pong.getCenter().x+476/3.5,this.pong.getCenter().y-75/3);

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

    spawnEnemy(child){
        var z = Math.floor(Math.random() * 4);
            child.setX(this.platforms.children.getArray()[z].body.x + 70); //70 hard code for center right now
            child.setY(this.platforms.children.getArray()[z].body.y - 20); //20 so above
            if(Math.random() < .5) {child.setVelocityX(50);}
            else {child.setVelocityX(-50);}
            child.setCollideWorldBounds(true);
            child.setBounce(1,0);
            child.setScale(.75)
    }
    GameOver()
    {
        this.isGameover=true;
        this.player.disableBody(true,true);
        this.enemies.children.iterate(function (child) { //sets initial position, velocity
            child.disableBody(true,true);
        }, this);
        this.LeaderBoard()
        //this.scoreText = this.add.text(300,250,'GameOver',{ fontSize: '50Px', fill: '#ffffff' });
    }
    Lives()
    {
        if(this.playerLives>0)
        {
            this.playerLives--;
            if( this.isAnyKeypressed==false)
            {
                this.IsPlayerImmune=true;
            }
            this.player.anims.play('idle',true)
            this.player.body.velocity.x=0;
            this.player.body.velocity.y=0;
            this.player.setPosition(400,600-this.pong.displayHeight-(this.player.displayHeight)/2)
            this.playerLivesText.setText(this.playerLives);
        }
        if(this.playerLives==0)
        {
            this.GameOver();
        }
    }
    Ui()
    {
        console.log(this.pong.getCenter().x)
        
        //this.playerLivesText.setPosition(this.pong.getTopRight().x-100,this.pong.getTopLeft().y+14);
    }
    LeaderBoard()
    {
        function loadJSON(callback) {   

            var xobj = new XMLHttpRequest();
                xobj.overrideMimeType("application/json");
            xobj.open('GET', '../LeaderBoard.json', true); // Replace 'my_data' with the path to your file
            xobj.onreadystatechange = function () {
                  if (xobj.readyState == 4 && xobj.status == "200") {
                    // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
                    callback(xobj.responseText);
                  }
            };
            xobj.send(null);  
         }
         loadJSON(function(response) {
            // Parse JSON string into object
             var LeaderBoard= JSON.parse(response);
             LeaderBoard.HighScores.forEach(function(e){
                 
             })
           //  console.log(this.score)
              
           });
           
    }
    update()
    {
        if(!this.isGameover)
        {
            this.Ui()
            this.move(false);
            this.enemyMove();
            this.eggMove();
            this.movePong();
           
            
            //console.log(this.player.displayHeight/2+this.player.y)
            if(this.player.displayHeight/2+this.player.y>=600)
            {
                
                if(this.IsPlayerImmune==false)
                {
                    this.Lives(this.pong.getTopLeft().x+150,this.pong.getTopLeft().y-7,this.score);
                }
            }   
            this.pterodactylMove();
        }
       
    }
    
}
