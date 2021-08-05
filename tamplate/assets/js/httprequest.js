function fetchData(url, data) {
    return new Promise(function(resolve, reject) {
        var formdata = {}
        data.forEach(dt => {
            formdata[dt.name] = dt.val;
        });

        var requestOptions = {
            method: 'POST',
            // body: formdata,
            body: JSON.stringify(formdata),
            redirect: 'follow'
        };

        fetch(url, requestOptions)
            .then(response => response.json())
            .then(result => resolve(result))
            .catch(error => reject(error));
    })
}