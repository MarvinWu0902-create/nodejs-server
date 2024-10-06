const express = require('express');
const jwt = require('jsonwebtoken');
const axios = require('axios');

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
    const {
        firstName,
        lastName,
        engName,
        account,
        password,
        gender,
        uid,
        birthDay,
        address,
        phoneNumber,
        email,
        eatLimit,
        emergencyName,
        emergencyPhoneNumber,
        emergencyRelation
    } = req.body;

    axios.get(`http://localhost:3000/users?account=${account}`)
        .then((result) => {
            if (result.data.length !== 0) {
                console.log('here');
                res.json({ message: '用戶已存在', status: 'fail' });
            } else {
                console.log('here1');
                return axios.post('http://localhost:3000/users',
                    {
                        firstName,
                        lastName,
                        engName,
                        account,
                        password,
                        gender,
                        uid,
                        birthDay,
                        address,
                        phoneNumber,
                        email,
                        eatLimit,
                        emergencyName,
                        emergencyPhoneNumber,
                        emergencyRelation
                    }
                )
            }
        })
        .then((result) => {
            console.log('here2');
            res.json({ message: '註冊成功', status: 'success' })
        })
        .catch((err) => {
            console.log('here3');
            // res.json({ message: '註冊失敗', status: 'fail' })
        });



    // if (users.findIndex((i) => i.email === email) !== -1) {
    //     console.log(users);
    //     return res.status(400).send({ error: '用戶已存在' })
    // }
    // users.push({
    //     email, username, password
    // });
    // console.log(users);


});
// 2.登入(webservice返回資料)
router.post('/login', (req, res) => {

    //2-1 驗證用戶是否存在
    const { account, password } = req.body;

    axios.get(`http://localhost:3000/users?account=${account}&password=${password}`)
        .then((result) => {
            if (result.data.length === 0) {
                res.json({ message: '用戶不存在', status: 'fail' })
            } else {
                //2-2 生成JWT簽章
                const { account, engName, password, id } = result.data[0];
                const token = jwt.sign({ account, engName }, key);
                //2-3 返回Token給用戶
                res.json({ message: '登入成功', status: 'success', token, user: { account, engName, password, id } })
            }
        })
        .catch((err) => {
            console.log(err);
            res.json({ message: '登入失敗', status: 'fail' });
        })

    // const user = users.find((i) => i.email === email && i.password === password);
    // console.log('註冊過的用戶資訊', user);

    // if (!user) {
    //     return res.json({ message: '用戶不存在' })
    // }

})
//3. 驗證用API (Vue 路由守衛每次都會先打這個API來判斷req.headers.authorization是否有token)

//token 可以登入完後取得存在cookie中
// 
// axios.get('.../verify',{headers:{authorization:token}})
router.get('/verify', (req, res) => {

    const token = req.headers['authorization'];
    // 3-1驗證用戶headers.authorization裏頭有token
    if (!token || token === '') {
        res.send({ message: '未登入' });
    } else {
        // 3-2進行驗證
        jwt.verify(token, key, (err, user) => {//user參數為payload
            if (err) {
                res.send({ message: '驗證錯誤' })
            } else {
                res.send({ message: '成功', user })
            }
        })
    }
})

module.exports = router;