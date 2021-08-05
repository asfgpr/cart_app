exports.login = function(req, res) {
    var body = ''
    req.on('data', function(data) {
        body += data
    })
    req.on('end', async function() {
        // console.log(body);
        var data = JSON.parse(body);

        if (data.type == 'login') {
            var validate = await require('../validate.js').login(data);
            // console.log(validate);
            if (validate.status) {
                let users = require("../user.js");
                let userObj = new users.user();
                let ress = await userObj.login(data.email, data.pass);
                if (!ress.status) {
                    validate.err.push({ 'name': ress.name, 'mess': ress.mess })
                    validate.status = false;
                } else {
                    res.setHeader("Set-Cookie", await userObj.addSession(validate.user.email));
                }
            }
            validate.user = '';
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(validate));
        } else {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({}));
        }
    })
}