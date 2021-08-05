var errorObj = showError();
if (document.querySelector(".btn-signup"))
    document.querySelector(".btn-signup").addEventListener('click', function() {
        let data = [{ name: 'type', val: 'signup' }];
        document.querySelectorAll(".form-controll").forEach(el => {
            data.push({ name: el.name, val: el.value });
        })
        disableButton(1);
        fetchData('/signup', data).then(res => {
            if (!res.status)
                errorObj.show(res.err);
            else
                window.location.reload();
            disableButton(0);
        });
    })

if (document.querySelector(".btn-login"))
    document.querySelector(".btn-login").addEventListener('click', function() {
        let data = [{ name: 'type', val: 'login' }];
        document.querySelectorAll(".form-controll").forEach(el => {
            data.push({ name: el.name, val: el.value });
        })
        disableButton(1);
        fetchData('/login', data).then(res => {
            if (!res.status)
                errorObj.show(res.err);
            else
                window.location.reload();
            disableButton(0);
        });
    })

if (document.querySelector(".btn-product"))
    document.querySelectorAll(".btn-product").forEach(function(el){
        el.addEventListener('click', function() {
            let currentEl = this;
            disableButton(1, currentEl);
            let id = this.parentElement.querySelector('input[name=id]').value;
            let data = [{ name: 'product-id', val: id }];
            let classList = Array.from(currentEl.classList);
            let url = classList.indexOf("add") >= 0 ? '/add-product' : '/remove-product';
            fetchData(url, data).then(res => {
                if(res.status){
                    console.log("success", res.count);
                    document.querySelector(".cart-count").innerText = res.count
                    classList.indexOf("remove-box") >= 0 ? removeCard(currentEl) : toggleCardButton(currentEl);
                }
                disableButton(0, currentEl);
            });
        })
    })

if (document.querySelectorAll("input[name=phone]"))
    document.querySelectorAll("input[name=phone]").forEach(el => {
        el.addEventListener("input", function() {
            this.value = this.value.replace(/[^0-9]/g, '').slice(0, 10);
        })
    })

document.querySelectorAll(".form-controll").forEach(el => {
    el.addEventListener('focus', function() {
        // this.classList.remove("input-err");
        errorObj.show(errorObj.data().filter(el => el.name != this.name));
    })
})

function showError() {
    var er = [];

    function show(errors) {
        er = errors
        let errorDiv = document.querySelector(".error-area");
        errorDiv.innerHTML = '';
        removeError()
        if (errors.length) {
            errorDiv.classList.remove('hide');
            errors.forEach(err => {
                let span = document.createElement("span");
                span.innerText = "- " + err.mess;
                errorDiv.append(span);
                let input = document.querySelector("input[name=" + err.name + "]");
                input.classList.add("input-err");
            })
        } else
            errorDiv.classList.add('hide');
    }

    function data() {
        return er;
    }

    return {
        show,
        data
    }
}

function removeError() {
    document.querySelectorAll(".form-controll").forEach(el => {
        el.classList.remove("input-err")
    })
}

function disableButton(state = true, currentBtn = false) {
    let btn = currentBtn ? [currentBtn] : document.querySelectorAll(".btn-login, .btn-signup");
    btn.forEach(btt => {
        if (state) {
            btt.querySelector("span").classList.add("hide");
            btt.querySelector("i").classList.remove("hide");
            btt.disabled = true;
        } else {
            btt.querySelector("span").classList.remove("hide");
            btt.querySelector("i").classList.add("hide");
            btt.disabled = false;
        }
    })
}

function toggleCardButton (btn){
    let classList = Array.from(btn.classList);
    if(classList.indexOf('add') >= 0){
        let another = btn.parentElement.querySelector(".btn-product.remove");
        btn.classList.add('hide');
        another.classList.remove('hide');
        console.log("add", another);
    }
    else if(classList.indexOf('remove') >= 0){
        console.log("remove")
        let another = btn.parentElement.querySelector(".btn-product.add");
        btn.classList.add('hide');
        another.classList.remove('hide');
    }
}

function removeCard (btn){
    btn.closest(".product-card").remove()
}