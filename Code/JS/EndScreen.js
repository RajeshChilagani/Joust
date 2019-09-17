class EndScreen extends Phaser.Scene
{
    constructor()
    {
        super({key:"EndScreen"});
        this.finalScore;
        
    }
    init(data)
    {
        this.finalScore=data.score;
        let lb=  [
            {
              "name": "test",
              "score": "03"
            },
            {
              "name": "test",
              "score": "02"
            },
            {
              "name": "test",
              "score": "01"
            }
          ]
          
    }
    preload()
    {
        this.load.image('Gameover', '../Assets/Gameover.png')
    }
    create()
    {
        this.GameoverImg=this.add.image(400,350,'Gameover');
        this.GameoverImg.setScale(1.6);
        //this.LeaderBoard();
        localStorage.setItem("lbs",JSON.stringify(this.lb))
            let final = this.finalScore
        if(localStorage)    
        {
            this.lb=JSON.parse(localStorage.getItem("lbs"))
            this.lb.some(function(e){
                if(e.score<final)
                {
                    e.score=final;
                    return true;
                }
                
            })
            this.Lb1 = this.add.text(300,100,this.lb[1].name,{ fontSize: '32px', fontFamily: '"Roboto Condensed"' ,fill: '#ffffff' });
            this.Lbname = this.add.text(400,100,this.lb[1].score,{ fontSize: '32px', fontFamily: '"Roboto Condensed"' ,fill: '#ffffff' });
            localStorage.setItem("lbs",JSON.stringify(this.lb))
        }
        
    }

}