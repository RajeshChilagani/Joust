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
    }
    create()
    {
       /* var text = this.add.text(300, 10, 'Please enter your name', { color: 'white', fontSize: '20px '});
        var domElement = this.add.dom(300, 100).createFromCache('nameform')
        domElement.addListener('click');
        domElement.on('click',function(e){

            if (event.target.name === 'playButton')
        {
            var inputText = this.getChildByName('fullname');

            //  Have they entered anythingAdding 
            if (inputText.value !== '')
            {
                //  Turn off the click events
                this.removeListener('click');

                //  Hide the login element
                this.setVisible(false);

                //  Populate the text with whatever they typed in
                text.setText('Welcome ' + inputText.value);
            }
           
        }
        })*/
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
          
            
       this.lb.some(function(e){
                if(e.score<final)
                {
                   //let inputtext = this.add.text(300, 10, 'Please enter your name', { color: 'white', fontSize: '20px '});
                    
                    e.score=final;
                    return true;
                }
                
            })
           for(let i=0; i<3;i++)
           {
            this.Lb1 = this.add.text(300,100+(i+1)*50,this.lb[i].name,{ fontSize: '32px', fontFamily: '"Roboto Condensed"' ,fill: '#ffffff' });
            this.Lbname = this.add.text(400,100+(i+1)*50,this.lb[i].score,{ fontSize: '32px', fontFamily: '"Roboto Condensed"' ,fill: '#ffffff' });
           }
            
            localStorage.setItem("lbs",JSON.stringify(this.lb))
        }
        
    }

}