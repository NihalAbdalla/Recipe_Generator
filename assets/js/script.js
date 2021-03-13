// Add the event listener to the main search bar
var searchButton = document.querySelector(".input-group-btn")
searchButton.addEventListener("click", search)

// Define three global variables to hold total calories, fat and carbs for selected recipe
var totCals = 0
var totFat = 0
var totCarbs = 0
var totProtein = 0

// Define variables and arrays to hold the recipe selected, its ingredients, their measurements, and the instructions for the recipe
var recipeName = ""
var ingredients = []
var measure = []
var instructions = ""


// Define the function which grabs the user-inputted ingredient query and grabs the fetch data for it from themealdb API
function search(event){

  // Prevents the page from refreshing upon searching
  event.preventDefault()

  // Resets the main display container to prevent overlapping of content upon repeated searches
  var recipeContainer = document.getElementById("recipe-generator-display")
  recipeContainer.innerHTML = ""

  // Gets the input data from the main search bar and stores it in a variable
  var searchIngredient = document.getElementById("recipeInput").value

  // Error handling function in case the user makes a blank search
  if (!searchIngredient) {
    noResults()
    return
  }

  // Main fetch call to grab all the search results for available recipes based on the user's ingredient input
  fetch("https://www.themealdb.com/api/json/v1/1/filter.php?i=" + searchIngredient).then(function(response) {
      if (response.ok) {
          return response.json().then(function(data) {
            if (data.meals){
              console.log(data)
              // Passes the meals array data to the displayRecipe function
              displayRecipes(data.meals)
            }
            else {
              noResults()
            }
          }) 
      }
          else{
              throw Error(response.statusText);
          }
  })
}

// Error handling function definition in case of a blank search or a search resulting in no recipes
function noResults() { 
  var recipeContainer = document.getElementById("recipe-generator-display")
  var errMessage = "Sorry, no results for this ingredient! Try another ingredient."
  var errMessageEl = document.createElement("h1")
  errMessageEl.setAttribute("class", "error-message")
  errMessageEl.textContent = errMessage
  recipeContainer.appendChild(errMessageEl)

}


// Function definition to display the available recipes after the initial ingredient search
function displayRecipes(meals) {

  // for loop to iterate over all of the recipe results from themealdb
 for (i=0; i<meals.length; i++){
   
  // This block of code removes a class attribute frm the main container in order to remove styling elements implemented in the second stage of dom manipulation
  var recipeContainer = document.getElementById("recipe-generator-display")
  recipeContainer.removeAttribute("class", "recipe-card")
  
  // This block of code creates the div container to hold the name of each available recipe which will also be the button the user will click to select it
  var currentRecipe = document.createElement("div")
  currentRecipe.textContent = meals[i].strMeal

  // Setting an "onclick" attribute to allow the getIngredients() function to be called when the user clicks the appropriate recipe
  currentRecipe.setAttribute("onclick","getIngredients(this.textContent)")
  currentRecipe.setAttribute("class", "recipe-button")
  recipeContainer.appendChild(currentRecipe)

  // This block of code creates a second div for each recipe which contains an image of that recipe
  let thumbEl = document.createElement("div")
  thumbEl.setAttribute("class", "image-div")
  let thumbURL = meals[i].strMealThumb
  console.log(thumbURL)
  thumbEl.innerHTML = "<img class = 'recipe-image' src='" + thumbURL  + "'>"
  recipeContainer.appendChild(thumbEl)
 } 
}

// Function definition to grab the ingredients for the selected recipe from themealdb
function getIngredients(recipe) {

  recipeName = recipe

    // This for loop formats the recipe name, replacing its spaces with underscores to allow it to be used as a search query in themealdb API
    for(i=0; i<recipe.length; i++){
         recipe = recipe.replace(" ","_")
    }

    // Second fetch to themealdb to grab the ingredients for the selected recipe
    fetch("https://www.themealdb.com/api/json/v1/1/search.php?s=" + recipe).then(function(response){
          if (response.ok) {
              return response.json().then(function(data) {
                console.log(data)
                  // Passing both the ingredient data and the recipe name to the edamamPass function
                  edamamPass(data.meals, recipeName)
              }) 
          }
              else{
                  throw Error(response.statusText)
              }
      })
}

// Function definition for the creation of the JSON object to be used as a POST request to the edamam API
function edamamPass(data) {
  console.log(data)

  // Grabbing and storing in a variable the first object in the main array which holds all the relevant recipe data for the selected recipe
  var obj = data[0]

  /* A forin loop to search the recipe data object to find all instances of "strIngredient" which contains each ingredient for the recipe. 
  The loop then adds these ingredients to an array */
  for (const key in obj) {
      if (key.includes('strIngredient') && obj[key]) {
        ingredients.push(obj[key])
      }
    }

  /* A forin loop to search the recipe data object to find all instances of "strMeasure" which contains a corresponding measurement amount for each ingredient 
  The loop then adds these measurements to an array */
  for (const key in obj) {
      if (key.includes('strMeasure') && obj[key]) {
        measure.push(obj[key].trim())
      }
    }

  /* A forin loop to search the recipe data object to find all instances of "strInstructions" which contains instructions for the selected recipe 
  The loop then adds the instructions to the instructions global variable */
  for (const key in obj){
    if (key.includes('strInstructions') && obj[key]) {
      instructions = obj[key]
    }
  }

  // Defines and populates an array containing each ingredient's name along with its corresponding measurement
  var recipeArray = []
  for (i=0; i<measure.length; i++) {
    recipeArray[i] = measure[i] + " " + ingredients[i]
  }
  
    // Creating the recipe object which will be stringified and passed as a POST request to the edamam nutritional analysis API
    var recipeObject = {
    title: recipeName,
    ingr: recipeArray,
    yield: 4
  }
  
  // Making the POST request to the edamam API in order to grab the nutrition info for the current recipe
  fetch('https://api.edamam.com/api/nutrition-details?app_id=749d2c5d&app_key=6212ed22f3bc63c9398aabf63bd48cc2', {
      method: 'POST',
      body: JSON.stringify(recipeObject),
      headers: {
        "Content-Type": "application/json"
      }
    }).then(function(response){
      if (response.ok) {
        return response.json().then(function(data) {
          console.log(data)
          // Passing the nutrition data to the sumNutrients() function
          sumNutrients(data)
        })
      }
      else {
        lowQuality()
      }
    })

  // Function definition to handle cases where the edamam API returns a 555 low quality error
  function lowQuality() {
    var recipeContainer = document.getElementById("recipe-generator-display")
    recipeContainer.innerHTML = ""

    var errEl = document.createElement("h1")
    errEl.setAttribute("class", "error-message")
    var errMessage = "Sorry, this recipe's nutrition facts cannot be obtained, please try again."
    errEl.textContent = errMessage
    recipeContainer.appendChild(errEl)
  }

}

// Function definition to take the nutrition data for Carbs, Fat, Protein and Calories and store each into its corresponding variable
function sumNutrients (data) {
  totCarbs = Math.round(totCarbs + data.totalNutrients.CHOCDF.quantity)
  totFat = Math.round(totFat + data.totalNutrients.FAT.quantity)
  totProtein = Math.round(totProtein + data.totalNutrients.PROCNT.quantity)
  totCals = Math.round(totCals + data.totalNutrients.ENERC_KCAL.quantity)

  console.log(data)

  // Calling the function to display the recipe card with ingredients, instructions and nutritional info
  displayComponents()
}

function displayComponents() {

  // Grabbing and resetting the content of the main display container
  var recipeContainer = document.getElementById("recipe-generator-display")
  recipeContainer.setAttribute("class", "recipe-card")
  recipeContainer.innerHTML = ""

  // Creates and displays the header for the recipe card with the recipe name
  var cardName = document.createElement("h2")
  cardName.textContent = recipeName
  cardName.setAttribute("id", "card-header")
  recipeContainer.appendChild(cardName)

  // Creates the <ul> element for the list of ingredients
  var cardIngredients = document.createElement("ul")
  cardIngredients.setAttribute("id", "recipe-list")
  recipeContainer.appendChild(cardIngredients)
  
  // For loop to display each ingredient in our array along with its correspoding measurement
  for (var i=0; i<ingredients.length; i++) {
    var listItem = document.createElement("li")
    listItem.textContent = ingredients[i] + " " + "|" + " " + measure[i]
    cardIngredients.appendChild(listItem)    
  }

  // Creates the element to display the serving size
  var servingsEl = document.createElement("h5")
  servingsEl.textContent = "Serves four."
  servingsEl.setAttribute("id", "servings-text")
  recipeContainer.appendChild(servingsEl)

  // Creates the element to display the instructions for the recipe
  var instrEl = document.createElement("p")
  instrEl.setAttribute("id", "recipe-instructions")
  instrEl.textContent = instructions
  recipeContainer.appendChild(instrEl)

  // Calorie header element
  var calHeader = document.createElement("h3")
  calHeader.setAttribute("class", "nutrition-content")
  calHeader.textContent = "Calories (per serving): "
  recipeContainer.appendChild(calHeader)

  // Actual caloric content
  var calEl = document.createElement("h4")
  calEl.textContent = Math.round(totCals/4) + " kCal"
  calHeader.appendChild(calEl)

  // Carb header element
  var carbHeader = document.createElement("h3")
  carbHeader.setAttribute("class", "nutrition-content")
  carbHeader.textContent = "Carbs (per serving): "
  recipeContainer.appendChild(carbHeader)

  // Actual carb content
  var carbEl = document.createElement("h4")
  carbEl.textContent = Math.round(totCarbs/4) + "g"
  carbHeader.appendChild(carbEl)

  // Fat header element
  var fatHeader = document.createElement("h3")
  fatHeader.setAttribute("class", "nutrition-content")
  fatHeader.textContent = "Fat (per serving): "
  recipeContainer.appendChild(fatHeader)

  // Actual fat content
  var fatEl = document.createElement("h4")
  fatEl.textContent = Math.round(totFat/4) + "g"
  fatHeader.appendChild(fatEl)

  // Protein header element
  var protHeader = document.createElement("h3")
  protHeader.setAttribute("class", "nutrition-content")
  protHeader.textContent = "Protein (per serving): "
  recipeContainer.appendChild(protHeader)

  // Actual protein content
  var protEl = document.createElement("h4")
  protEl.textContent = Math.round(totProtein/4) + "g"
  protHeader.appendChild(protEl)

}

  


