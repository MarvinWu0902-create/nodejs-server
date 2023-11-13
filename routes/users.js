const express = require('express');
const jwt = require('jsonwebtoken');

const router = express.Router();

router.use((req, res, next) => {
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With, Content-type,Accept,X-Access-Token,X-Key,Authorization');
    res.header('Access-Control-Allow-Origin', '*');
    next();
})

const users = [{
    email: 'abc@gmail.com',
    username: 'Marvin',
    password: '123'
}];

const key = 'YMYIP';
// 1.註冊
router.post('/signup', (req, res) => {
    const { email, username, password } = req.body;

    if (users.findIndex((i) => i.email === email) !== -1) {
        console.log(users);
        return res.status(400).send({ error: '用戶已存在' })
    }
    users.push({
        email, username, password
    });
    console.log(users);
    res.status(201).send({ message: '註冊成功' })

})
// 2.登入(webservice返回資料)
router.post('/login', (req, res) => {

    //2-1 驗證用戶是否存在
    const { email, password } = req.body;///實際上會先打webservie返回用戶資訊

    const user = users.find((i) => i.email === email && i.password === password);
    console.log('註冊過的用戶資訊', user);

    if (!user) {
        return res.json({ message: '用戶不存在' })
    }
    //2-2 生成JWT簽章
    const username = user.username;
    const token = jwt.sign({ email, username }, key);
    //2-3 返回Token給用戶
    res.json({ message: '成功', token, user })
})
//3. 驗證用API (Vue 路由守衛每次都會先打這個API來判斷req.headers.authorization是否有token)

//token 可以登入完後取得存在cookie中
// 
// axios.get('.../verify',{headers:{authorization:token}})
router.get('/verify', (req, res) => {

    const token = req.headers['authorization'];
    // 3-1驗證用戶headers.authorization裏頭有token
    if (!token||token==='') {
        res.send({ message: '未登入' });
    } else {
        // 3-2進行驗證
        jwt.verify(token, key, (err, user) => {//user參數為payload
            if (err) {
                res.send({ message: '驗證錯誤' })
            }else{
                res.send({ message: '成功', user })
            }
        })
    }
})

module.exports = router;