fetch("https://www.themealdb.com/api/json/v1/1/filter.php?i=cheese").then(function(response){
  // The browser fetches the resource from the remote server without first looking in the cache.
  // The browser will then update the cache with the downloaded resource.
    if (response.ok) {
        return response.json().then(function(data) {
            console.log(data);
        }) 
    }
        else{
            throw Error(response.statusText);
        }
})




