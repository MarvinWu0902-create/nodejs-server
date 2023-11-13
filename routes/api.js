var express = require('express');
var router = express.Router();

const data = [{ id: 1, name: 'Marvin' }];
router.get('/products', function (req, res, next) {
    //   res.render('index', { title: 'API' });

    res.json(data);
});

let timesId=3;
router.post('/products', function (req, res, next) {
    //   res.render('index', { title: 'API' });
    const postData=req.body;
    console.log( postData);
    data.push({...postData,id:timesId});
    timesId+=1;
    console.log(data);
    res.json(data);

});

router.delete('/products/:id',(req,res)=>{
    const id=req.params.id;
    data.forEach((i,idx)=>{
        if(i.id==id){
            data.splice(idx,1)
        }
    });
    res.json(data)
})




module.exports = router;
