import express from 'express';
import bodyParser from 'body-parser';
import fs from 'fs';
import path from 'path';

const app = express();
const PORT = 3001;

//Load all proverbs
let proverbsData = [];
fs.readFile('proverbs.json', 'utf-8', (err, data)=>{
        if(err){
                console.error('an error occured', err);
        }else{
                proverbsData = JSON.parse(data);
        }
});
app.use(bodyParser.json());

//Get random proverb
app.get('/proverbs/random', (req,res)=>{
        const randomIndex =  Math.floor( Math.random() * proverbsData.length);
        const randomProverb = proverbsData[randomIndex];
        res.json(randomProverb);
});

//get specific proverb by id
app.get('/proverbs/:id',(req,res)=>{
        const proverbId = parseInt( req.params.id);
        const proverb = proverbsData.find(proverb=>proverb.id ===proverbId);
        if(proverb){
                res.json(proverb);   
        }else{
                res.status(404).json({message: "ضرب المثل یافت نشد"});
        }

});

//get proverb by filter
app.get('/proverbs', (req,res)=>{
        const proverbType = req.query.type;
        if(!proverbType){
                res.status(400).json({message: 'ضرب المثل با فلتر یافت نشد'});
                return;
        }
        const filteredProverbs = proverbsData.filter(proverb =>proverb.proverbType === proverbType);
        res.json(filteredProverbs);

});

 app.post('/proverbs',(req,res)=>{
       const newProverb = req.body;
       if(!newProverb.textDari || !newProverb.textPashto){
        res.status(400).json({Message: 'ضرب المثل ثبت نشد لطفا متن ضرب المثل را با تمام مشخصاتش وارد کنید'});
        return;
       }
       //generate auto increment id
       const maxId = proverbsData.reduce((max, proverb)=>(proverb.id>max?proverb.id : max),0);
       newProverb.id = maxId + 1;

       proverbsData.push(newProverb);

       res.status(201).json({message: 'ضرب المثل موفقانه ثبت شد', proverb: newProverb});
})

//delete proverbs

app.delete('/proverbs/:id', (req,res)=>{
              const proverbId = parseInt(req.params.id);
              const index = proverbsData.findIndex(proverb => proverb.id === proverbId);
              if(index === -1){
                res.status(404).json({message: 'ضرب المثل یافت نشد'});
                return;
              }
              const deleteProverb =  proverbsData.splice(index, 1);
       
              res.json({message:'ضرب المثل موفقانه حذف شد', joke: deleteProverb});
})


app.listen(PORT, (req,res)=>{
        console.log(`Server is running on port ${PORT}`);
})