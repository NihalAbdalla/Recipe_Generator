var searchButton = document.querySelector(".submit-btn")
searchButton.addEventListener("click", search)

// Define three global variables to hold total calories, fat and carbs for selected recipe
var totCals = 0
var totFat = 0
var totCarbs = 0
var totProtein = 0

var recipeName = ""
var ingredients = []
var measure = []
var instructions = ""

function search(){

  var searchIngredient = document.getElementById("recipeInput").value

  fetch("https://www.themealdb.com/api/json/v1/1/filter.php?i=" + searchIngredient).then(function(response) {
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




function displayRecipes(meals) {
 for (i=0; i<meals.length; i++){
    var recipeContainer = document.getElementById("recipe-generator-display")
    var currentRecipe = document.createElement("div")
    currentRecipe.textContent = meals[i].strMeal
    currentRecipe.setAttribute("onclick","getIngredients(this.textContent)")
    recipeContainer.appendChild(currentRecipe)
 } 
}

function getIngredients(recipe) {

  recipeName = recipe

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


function edamamPass(data) {

  var obj = data[0]
  for (const key in obj) {
      if (key.includes('strIngredient') && obj[key]) {
        ingredients.push(obj[key])
      }
    }


  for (const key in obj) {
      if (key.includes('strMeasure') && obj[key]) {
        measure.push(obj[key])
      }
    }
  
  // ***Measurements-to-gram converter goes here***
  // for (i=0; i<measure.length; i++) {

  // }

    for (const key in obj){
      if (key.includes('strInstructions') && obj[key]) {
        instructions = obj[key]
      }
    }

    fetchNutrition (ingredients)
    
    console.log(ingredients)
    console.log(measure)
    console.log(instructions)

}

function fetchNutrition (ingredients) {
  for (var i=0; i<ingredients.length; i++) {
    var ingredient = ingredients[i]
    var ingredientForm = ingredient.replace(" ", "%20")
    
    // ***Ask TA why we had to use addNutrients function below***
    fetch("https://api.edamam.com/api/food-database/v2/parser?ingr=" + ingredientForm + "&app_id=15deb37b&app_key=ec341a9362cca4de065a6bd100736317").then(function(response) {
        if (response.ok) {
            return response.json().then(function(data) {
                console.log(data)
                addNutrients(data)
            })
        }
        else {
            throw Error(response.statusText);
        }
    })

  }

}

function addNutrients(data) {
  console.log(data.hints[0].food.nutrients.CHOCDF)

  totCarbs = totCarbs + data.hints[0].food.nutrients.CHOCDF
  totFat = totFat + data.hints[0].food.nutrients.FAT
  totCals = totCals + data.hints[0].food.nutrients.ENERC_KCAL
  totProtein = totProtein + data.hints[0].food.nutrients.PROCNT

  displayComponents()

  console.log(totCarbs)
  console.log(totFat)
  console.log(totProtein)
  console.log(totCals)
}

function displayComponents() {
  var recipeContainer = document.getElementById("recipe-generator-display")
  recipeContainer.innerHTML = ""

  var cardName = document.createElement("h2")
  cardName.textContent = recipeName
  recipeContainer.appendChild(cardName)

  var cardIngredients = document.createElement("ul")
  recipeContainer.appendChild(cardIngredients)

  console.log(ingredients.length)
  
  for (var i=0; i<ingredients.length; i++) {
    var listItem = document.createElement("li")
    console.log(ingredients[i])
    listItem.textContent = ingredients[i] + " " + "|" + " " + measure[i]
    cardIngredients.appendChild(listItem)    
  }

  var instrEl = document.createElement("p")
  instrEl.textContent = instructions
  recipeContainer.appendChild(instrEl)

  var calHeader = document.createElement("h3")
  calHeader.textContent = "Calories: "
  recipeContainer.appendChild(calHeader)

  var calEl = document.createElement("h4")
  calEl.textContent = totCals
  recipeContainer.appendChild(calEl)

  var carbHeader = document.createElement("h3")
  carbHeader.textContent = "Carbs: "
  recipeContainer.appendChild(carbHeader)

  var carbEl = document.createElement("h4")
  carbEl.textContent = totCarbs
  recipeContainer.appendChild(carbEl)

  var fatHeader = document.createElement("h3")
  fatHeader.textContent = "Fat: "
  recipeContainer.appendChild(fatHeader)

  var fatEl = document.createElement("h4")
  fatEl.textContent = totFat
  recipeContainer.appendChild(fatEl)

  var protHeader = document.createElement("h3")
  protHeader.textContent = "Protein: "
  recipeContainer.appendChild(protHeader)

  var protEl = document.createElement("h4")
  protEl.textContent = totProtein
  recipeContainer.appendChild(protEl)



}

  
