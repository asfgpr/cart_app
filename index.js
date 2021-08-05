const http = require('http');
const url = require('url');
const port = 3000;
const host = 'localhost'
var ejs = require('ejs');
var fs = require('fs');
var path = require('path');

http.createServer(async function(req, res) {
    let users = require("./app/user.js");
    let userObj = new users.user();
    let active = await userObj.getActiveUser(req);
    const reqUrl = url.parse(req.url, true);
    var filePath = req.url.split("/");
    // console.log(filePath);
    if(filePath[1] && filePath[1] == "assets"){
        var extname = String(path.extname(req.url)).toLowerCase();
        console.log(extname);
        var mimeTypes = {
            '.html': 'text/html',
            '.js': 'text/javascript',
            '.css': 'text/css',
            '.json': 'application/json',
            '.png': 'image/png',
            '.jpg': 'image/jpg',
            '.gif': 'image/gif',
            '.svg': 'image/svg+xml',
            '.wav': 'audio/wav',
            '.mp4': 'video/mp4',
            '.woff': 'application/font-woff',
            '.ttf': 'application/font-ttf',
            '.eot': 'application/vnd.ms-fontobject',
            '.otf': 'application/font-otf',
            '.wasm': 'application/wasm'
        };

        var contentType = mimeTypes[extname] || 'application/octet-stream';
        console.log(contentType);

        fs.readFile('./tamplate'+req.url, function(error, content) {
            if (error) {
                if(error.code == 'ENOENT') {
                    fs.readFile('./404.html', function(error, content) {
                        res.writeHead(404, { 'Content-Type': 'text/html' });
                        res.end(content, 'utf-8');
                    });
                }
                else {
                    res.writeHead(500);
                    res.end('Sorry, check with the site admin for error: '+error.code+' ..\n');
                }
            }
            else {
                res.writeHead(200, { 'Content-Type': contentType });
                res.end(content, 'utf-8');
            }
        });
    }
    else if (reqUrl.pathname == "/home") {
        if(active){
            let products = await userObj.getProducts();
            let myProducts = await userObj.getMyProducts(active.user.email);
            var htmlContent = fs.readFileSync(__dirname + '/tamplate/view/products.ejs', 'utf8');
            var htmlRenderized = ejs.render(htmlContent, { filename: './tamplate/view/products.ejs', user: active, products: products, myProducts: myProducts });

            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/html');
            res.end(htmlRenderized);
        }
        else{
            var htmlContent = fs.readFileSync(__dirname + '/tamplate/view/index.ejs', 'utf8');
            var htmlRenderized = ejs.render(htmlContent, { filename: './tamplate/view/index.ejs', user: active });

            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/html');
            res.end(htmlRenderized);
        }
    }
    else if (reqUrl.pathname == "/profile") {
        if(active){
            let myProducts = await userObj.getMyProducts(active.user.email);
            var htmlContent = fs.readFileSync(__dirname + '/tamplate/view/index.ejs', 'utf8');
            var htmlRenderized = ejs.render(htmlContent, { filename: './tamplate/view/index.ejs', user: active, myProducts: myProducts });

            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/html');
            res.end(htmlRenderized);
        }
        else{
            res.writeHead (301, {'Location': '/login'});
            res.end('');
        }
    }
    else if(reqUrl.pathname == "/cart"){
        if(active){
            let myProducts = await userObj.getMyProducts(active.user.email);
            var htmlContent = fs.readFileSync(__dirname + '/tamplate/view/cart.ejs', 'utf8');
            var htmlRenderized = ejs.render(htmlContent, { filename: './tamplate/view/cart.ejs', user: active, myProducts: myProducts });

            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/html');
            res.end(htmlRenderized);
        }
        else{
            res.writeHead (301, {'Location': '/login'});
            res.end('');
        }
    }
    else if(reqUrl.pathname == "/add-product" || reqUrl.pathname == "/remove-product"){
        let adding = reqUrl.pathname == "/add-product";
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        let ress = {status: false, count: 0};
        if(active){
            var body = ''
            req.on('data', function(data) {
                body += data
            })
            req.on('end', async function() {
                var data = JSON.parse(body);
                if(data['product-id']){
                    let myProducts = adding ? await userObj.addProduct(active.user.email, data['product-id']) : await userObj.removeProduct(active.user.email, data['product-id']);
                    ress.status = true;
                    ress.count = myProducts.length;
                }
                res.end(JSON.stringify(ress));
            })
        }
    }
    else if (reqUrl.pathname == "/login"){
        if(req.method === 'POST')
            require('./app/api/login.js').login(req, res, reqUrl);
        else{
            if(active){
                res.writeHead (301, {'Location': '/home'});
                res.end('');
            }
            else{
                var htmlContent = fs.readFileSync(__dirname + '/tamplate/view/login.ejs', 'utf8');
                var htmlRenderized = ejs.render(htmlContent, { filename: './tamplate/view/login.ejs', user: active });

                res.statusCode = 200;
                res.setHeader('Content-Type', 'text/html');
                res.end(htmlRenderized);
            }
        }
    }
    else if (reqUrl.pathname == "/signup"){
        if(req.method === 'POST')
            require('./app/api/signup.js').signup(req, res, reqUrl);
        else{
            if(active){
                res.writeHead (301, {'Location': '/home'});
                res.end('');
            }
            else{
                var htmlContent = fs.readFileSync(__dirname + '/tamplate/view/signup.ejs', 'utf8');
                var htmlRenderized = ejs.render(htmlContent, { filename: './tamplate/view/signup.ejs', user: active });

                res.statusCode = 200;
                res.setHeader('Content-Type', 'text/html');
                res.end(htmlRenderized);
            }
        }
    }
    else if (reqUrl.pathname == "/logout") {
        let users = require("./app/user.js");
        let userObj = new users.user();
        res.setHeader("Set-Cookie", await userObj.removeSession());
        res.writeHead (301, {'Location': '/home'});
        res.end('');
    }
    else{
        res.writeHead (301, {'Location': '/home'});
        res.end('');
    }



}).listen(port, host, () => {
    console.log(`Server running at http://${host}:${port}/`);
});