function getBlankError(inpList, data) {
    let err = [];
    inpList.forEach(name => {
        if (!data[name[0]])
            err.push({ name: name[0], mess: 'please enter ' + name[1] });
    })
    return err;
}

function isEmailValid(email) {
    var emailRegex = /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;
    if (!email)
        return false;

    if (email.length > 254)
        return false;

    var valid = emailRegex.test(email);
    if (!valid)
        return false;

    var parts = email.split("@");
    if (parts[0].length > 64)
        return false;

    var domainParts = parts[1].split(".");
    if (domainParts.some(function(part) { return part.length > 63; }))
        return false;

    return true;
}

exports.signup = async function(data) {
    let thisRes = { status: false, err: [] };
    let inpList = [
        ['name', 'name'],
        ['email', 'email'],
        ['phone', 'phone'],
        ['pass', 'password'],
        ['pass2', 'confirm password']
    ];
    let err = await getBlankError(inpList, data)
    if (!err.length) {
        if (data[inpList[2][0]].length != 10)
            err.push({ name: inpList[2][0], mess: 'Please enter 10 digit valid phone.' });
        if (data[inpList[3][0]] != data[inpList[4][0]])
            err.push({ name: inpList[3][0], mess: 'Password not mached.' });
        if (await !isEmailValid(data[inpList[1][0]])) {
            err.push({ name: inpList[1][0], mess: 'Please enter valid email.' });
        }
        if (!err.length) {
            thisRes.status = true;
            thisRes.user = data;
        }
    }
    thisRes.err = err;
    return thisRes;
}

exports.login = async function(data) {
    let thisRes = { status: false, err: [] };
    let inpList = [
        ['email', 'email'],
        ['pass', 'password']
    ];
    let err = await getBlankError(inpList, data)
    if (!err.length) {
        thisRes.status = true;
        thisRes.user = data;
    }
    thisRes.err = err;
    return thisRes;
}