class Wave1 extends Phaser.Scene
{
    constructor(){
        super({key:"LoadSprite"});
    }
    preload()
    {
       
        this.load.image('baseplatform','../Assets/baseplatform.png');
        this.load.image('platform','../Assets/platform1.png');
        this.load.image('enemie','../Assets/star.png');
        this.load.spritesheet('player','../Assets/dude.png',{frameWidth:32,frameHeight:48});
    }
    create()
    {
        let score=0;
        let scoreText;

        this.platforms = this.physics.add.staticGroup();
        this.platforms.create(350, 568, 'baseplatform').setScale(2).refreshBody();
        this.platforms.create(100, 150, 'platform');
        this.platforms.create(400, 300, 'platform');
        this.platforms.create(700, 150, 'platform');
        this.platforms.create(700, 450, 'platform');
        this.platforms.create(100, 450, 'platform');
        
        this.player = this.physics.add.sprite(100,450,'player');
        this.player.setBounce(0.1);
        this.player.setCollideWorldBounds(true);

        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('player', { start: 0, end: 3 }),
            frameRate: 30,
            repeat: -1
        });
        
        this.anims.create({
            key: 'turn',
            frames: [ { key: 'player', frame: 4 } ],
            frameRate: 20
        });
        
        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('player', { start: 5, end: 8 }),
            frameRate: 30,
            repeat: -1
        });

        this.physics.add.collider(this.player,this.platforms)
       

       this.enemies = this.physics.add.group({
            key: 'enemie',
            repeat: 11,
            setXY: { x: 12, y: 0, stepX: 70 }
        });
        
        this.enemies.children.iterate(function (child) {
        
            child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
        
        });
        this.physics.add.collider(this.enemies,this.platforms)
        this.physics.add.overlap(this.player,this.enemies,CheckCollision,null,this)

        scoreText = this.add.text(20,20,'Score:0',{ fontSize: '32px', fill: '#ffffff' });

        function CheckCollision(player,enemie)
        {
            console.log(player.y+24,enemie.y)
           if(player.y+24<enemie.y)
           {
               enemie.disableBody(true,true);
               score+=1;
               scoreText.setText('Score: ' + score);
           }
        }
          
        
    }
    update()
    {
        this.cursors = this.input.keyboard.createCursorKeys();
        if (this.cursors.left.isDown)
        {
            this.player.setVelocityX(-160);

            this.player.anims.play('left', true);
        }
        else if (this.cursors.right.isDown)
        {
            this.player.setVelocityX(160);

            this.player.anims.play('right', true);
        }
        else
        {
            this.player.setVelocityX(0);

            this.player.anims.play('turn');
        }
        this.input.keyboard.on('keyup_UP',function(event){
            this.player.setVelocityY(-100);
        },this)

    }
}