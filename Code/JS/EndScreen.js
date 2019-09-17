class EndScreen extends Phaser.Scene
{
    constructor()
    {
        super({key:"EndScreen"});
        this.finalScore;
        this.lb
        
    }
    init(data)
    {
        this.finalScore=data.score;
      
    }
    preload()
    {
        this.load.image('Gameover', '../Assets/Gameover.png')
        //this.load.html('form','../Form.html')
    }
    create()
    {
        
        this.GameoverImg=this.add.image(400,350,'Gameover');
        this.GameoverImg.setScale(1.6);
        let final = this.finalScore
        if(localStorage)    
        {
            this.lb=JSON.parse(localStorage.getItem("lbs"))
            if(JSON.stringify(this.lb)==='null')
            {
                console.log("error")
                 this.lb=  [
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
            let temp = final
            for(let i=0;i<3;i++)
            { 
                if(this.lb[i].score<temp)
                {
                    let temptemp= this.lb[i].score
                    this.lb[i].score=temp;
                    temp=temptemp;
                }
            }
            this.LeaderBoard=this.add.text(600,0,'LeaderBoard',{ fontSize: '32px', fontFamily: '"AGENCYFB"' ,fill: '#ffffff' });
           for(let i=0; i<3;i++)
           {
            this.Lb1 = this.add.text(625,(i+1)*50,this.lb[i].name,{ fontSize: '32px', fontFamily: '"Roboto Condensed"' ,fill: '#ffffff' });
            this.Lbname = this.add.text(725,(i+1)*50,this.lb[i].score,{ fontSize: '32px', fontFamily: '"Roboto Condensed"' ,fill: '#ffffff' });
           }
            
            localStorage.setItem("lbs",JSON.stringify(this.lb))
        }
        
        

    }

}