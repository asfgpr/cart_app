var mysql = require('mysql');

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "user_authentication"
});

// con.connect(function(err) {
//     if (err) throw err;
//     console.log("Connected!");
//     con.query("SELECT * FROM user", function(err, result, fields) {
//         if (err) throw err;
//         console.log(result);
//     });
// });

exports.user = function() {
    this.register = async function(name, email, phone, pass) {
        var res = { 'status': false, 'mess': '' };
        let pr = new Promise((resolve) => {
            con.query("SELECT `id` FROM `user` WHERE `email` = '" + email + "'", async function(err, result) {
                // console.log('SELECT `id` FROM `user` WHERE `email` = ' + email, result.length);
                if (result.length) {
                    res.mess = 'User already exist';
                    res.name = 'email';
                } else {
                    let pr2 = new Promise(resolve => {
                        con.query("INSERT INTO `user`(`name`, `email`, `phone`, `password`) VALUES('" + name + "', '" + email + "', '" + phone + "', '" + pass + "')", function(err, result) {
                            res.status = true;
                            resolve();
                        })
                    })
                    await pr2;
                }
                resolve();
            })
        })
        await pr;
        // console.log('res', res);
        return res;
    }

    this.getUser = async function(email) {
        var res = { 'status': false, 'mess': '' };
        let pr = new Promise((resolve) => {
            con.query("SELECT * FROM `user` WHERE `email` = '" + email + "'", function(err, result) {
                // console.log('SELECT `id` FROM `user` WHERE `email` = ' + email, result.length);
                if (result.length) {
                    res.status = true;
                    res.user = result[0];
                } else {
                    res.mess = 'Technical error! please try again.';
                }
                resolve();
            })
        })
        await pr;
        return res;
    }

    this.randomKey = function(length = 30) {
        characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        charactersLength = characters.length;
        randomString = '';
        for (i = 0; i < length; i++) {
            randomString += characters[Math.round(Math.random() * charactersLength - 1)];
        }
        return randomString;
    }

    this.login = async function(email, pass) {
        var res = { 'status': false, 'mess': '' };
        let checkUser = await this.getUser(email);
        if (checkUser.status) {
            let user = checkUser.user;
            if (user.password == pass)
                res = checkUser;
            else {
                res.mess = "Incorrect password";
                res.name = "pass";
            }
        } else {
            res.mess = "Email not registered! Please signup.",
                res.name = "email";
        }
        return res;
    }

    this.addSession = async function(email) {
        let key = await this.randomKey();
        let pr = new Promise(resolve => {
            con.query("INSERT INTO `session`(`email`, `session_key`) VALUES('" + email + "', '" + key + "')", function() {
                resolve();
            })
        })
        await pr;
        return 'sessionKey=' + key + '; Max-Age=' + (86400 * 30 * 12) + '; HttpOnly, true';
    }

    this.removeSession = function() {
        return 'sessionKey=; Max-Age=' + (-3600) + '; HttpOnly, true';
    }

    this.getActiveUser = async function(req) {
        let cookieString = req.headers.cookie;
        let cookiesObj = await this.getCookies(cookieString || '');
        if (cookiesObj.sessionKey) {
            let key = cookiesObj.sessionKey;
            let getUserFunction = this.getUser;
            let pr = new Promise(resolve => {
                con.query("SELECT `email` FROM `session` WHERE `session_key` = '" + key + "'", async function(err, result) {
                    if (result.length) {
                        let email = result[0].email;
                        let user = await getUserFunction(email);
                        resolve(user);
                    } else
                        resolve(false);
                })
            });
            return await pr;
        }
        return false;
    }

    this.getCookies = function(cookies) {
        let extracted = {};
        cookies.split("; ").forEach(ck => {
            if (ck) {
                let ckk = ck.split('=');
                extracted[ckk[0]] = ckk[1];
            }
        });
        return extracted;
    }

    this.getProducts = async function(){
        let pr = new Promise((resolve) => {
            con.query("SELECT * FROM `product`", async function(err, result) {
                resolve(result);
            })
        })
        return await pr;
    }

    this.getMyProducts = async function(email){
        let pr = new Promise((resolve) => {
            con.query("SELECT * FROM `product` WHERE `id` IN (SELECT `product_id` from `cart` WHERE `email` = '"+email+"')", async function(err, result) {
                resolve(result);
            })
        })
        return await pr;
    }

    this.addProduct = async function(email, productId){
        let pr = new Promise((resolve) => {
            con.query("INSERT INTO `cart`(`email`, `product_id`) VALUES('" + email + "', '" + productId + "')", async function(err, result) {
                resolve();
            })
        })
        await pr;
        return await this.getMyProducts(email);
    }

    this.removeProduct = async function(email, productId){
        let pr = new Promise((resolve) => {
            con.query("DELETE FROM `cart` WHERE `product_id` = '"+ productId +"' AND `email` = '"+ email +"'", async function(err, result) {
                resolve();
            })
        })
        await pr;
        return await this.getMyProducts(email);
    }
}