exports.signup = function(req, res) {
    var body = ''
    req.on('data', function(data) {
        body += data
    })
    req.on('end', async function() {
        var data = JSON.parse(body);

        if (data.type == 'signup') {
            var validate = await require('../validate.js').signup(data);
            // console.log(validate);
            if (validate.status) {
                let users = require("../user.js");
                let userObj = new users.user();
                let ress = await userObj.register(data.name, data.email, data.phone, data.pass);
                // console.log(ress);
                if (!ress.status) {
                    validate.err.push({ 'name': ress.name, 'mess': ress.mess });
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