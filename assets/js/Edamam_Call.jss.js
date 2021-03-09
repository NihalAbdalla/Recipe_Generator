fetch("https://api.edamam.com/api/food-database/v2/parser?ingr=mozzarella&app_id=15deb37b&app_key=ec341a9362cca4de065a6bd100736317").then(function(response) {
    if (response.ok) {
        return response.json().then(function(data) {

            console.log(data);
        })
    }
    else {
        throw Error(response.statusText);
    }
})



