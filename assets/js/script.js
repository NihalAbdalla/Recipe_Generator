var searchButton = document.querySelector(".submit-btn")
searchButton.addEventListener("click", search)

function search(){
var searchIngredient = document.getElementById("recipeInput").value

fetch("https://www.themealdb.com/api/json/v1/1/filter.php?i=" + searchIngredient).then(function(response){
  // The browser fetches the resource from the remote server without first looking in the cache.
  // The browser will then update the cache with the downloaded resource.
    if (response.ok) {
        return response.json().then(function(data) {
            console.log(data)
            displayRecipes(data.meals)
            console.log(data.meals)
        }) 
    }
        else{
            throw Error(response.statusText);
        }
})
}




function displayRecipes(meals){
 for (i=0; i<meals.length; i++){
    var recipeContainer = document.getElementById("recipe-generator-display")
    var currentRecipe = document.createElement("div")
    currentRecipe.textContent = meals[i].strMeal
    currentRecipe.setAttribute("onclick","getIngredients(this.textContent)")
    recipeContainer.appendChild(currentRecipe)
 } 
}

function getIngredients(recipe){

    for(i=0; i<recipe.length; i++){
         recipe = recipe.replace(" ","_")
    }
    console.log(recipe)

    fetch("https://www.themealdb.com/api/json/v1/1/search.php?s=" + recipe).then(function(response){
        // The browser fetches the resource from the remote server without first looking in the cache.
        // The browser will then update the cache with the downloaded resource.
          if (response.ok) {
              return response.json().then(function(data) {
                  console.log(data)
                  edamamPass(data.meals)
              }) 
          }
              else{
                  throw Error(response.statusText)
              }
      })
}


function edamamPass(data){
var obj = data[0]
var ingredients = []
for (const key in obj) {
    if (key.includes('strIngredient') && obj[key]) {
      ingredients.push(obj[key])
    }
  }



var measure = []
for (const key in obj) {
    if (key.includes('strMeasure') && obj[key]) {
      measure.push(obj[key])
    }
  }


  var instructions = ""

  for (const key in obj){
    if (key.includes('strInstructions') && obj[key]) {
      instructions = obj[key]
    }
  }
  
  console.log(ingredients)
  console.log(measure)
  console.log(instructions)


    // fetch("https://api.edamam.com/api/food-database/v2/parser?ingr=" + ingredients + "&app_id=15deb37b&app_key=ec341a9362cca4de065a6bd100736317").then(function(response) {
    //     if (response.ok) {
    //         return response.json().then(function(data) {
    //             console.log(data);
    //         })
    //     }
    //     else {
    //         throw Error(response.statusText);
    //     }
    // })

}
  

