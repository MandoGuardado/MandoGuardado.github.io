var columnsInRow = 0;
const UNSPLASH_URL = "https://api.unsplash.com/search/photos?client_id=8_KeByDdZUF4TDAX-2sY_qLcG11ZsKhIE4zTqECrZhs&query=";
const OPEN_WEATHER_URL = "https://api.openweathermap.org/data/2.5/weather?appid=b7887563382c30a5d438d5421be3a549&units=imperial&q="
const destinationCards = document.getElementsByClassName('destinations')[0];
const headerElement = document.getElementsByClassName('destinationHeader')[0];
let isThereDestinationsCards = false;


// function that get called when user enters information and clicks "Add to list" button.
function vacationInfo(form) {
    var destinationName = form.dname.value;
    var location = form.location.value;
    // var photoUrl = form.photo.value;
    var description = form.description.value;

    var completedCard = createCard(destinationName, location, description) //removed photoUrl parameter
    destinationCards.appendChild(completedCard)
    form.reset();
    updateCardHeader();

}

// Function that creates the bootstrap card component, each element is create individually and bootstrap classes are added.
function createCard(destinationName, location, description) {  //removed photoUrl parameter
    const card = createElement("div", "card cardStyles")
    //  document.createElement('div');
    // card.className = "card cardStyles";
    card.style = "width: 14rem;"

    const image = createElement("img", "card-img-top")
    // document.createElement('img');
    // image.className ="card-img-top";
    fetchRandomUrl(image, destinationName)

    const body = document.createElement("div");
    body.className = "card-body";

    const h5Element = createElement("h5", "class-title", destinationName)
    // document.createElement("h5");
    // h5Element.className = "card-title";
    // h5Element.innerText = destinationName

    const h6Element = createElement("h6", "card-subtitle mb-2 text-muted", location)
    // document.createElement("h6");
    // h6Element.className = "card-subtitle mb-2 text-muted"
    // h6Element.innerText = location

    const tempElement = createElement("h6", "card-subtitle mb-2 text-muted");
    getLocationWeather(tempElement, location)

    const pElement = createElement("p", "card-text", description)
    //  document.createElement("p");
    // pElement.className = "card-text";
    // pElement.innerText = description;

    const editElment = createElement("a", "btn btn-warning edit-button cardStyles", "Edit")
    //  document.createElement("a");
    // editElment.className = "btn btn-warning edit-button cardStyles";
    // editElment.innerText= "Edit";
    editElment.addEventListener("click", editCardInfo);

    const deleteElment = createElement("a", "btn btn-danger delete-button cardStyles", "Delete")
    //  document.createElement("a");
    // deleteElment.className = "btn btn-danger delete-button cardStyles";
    // deleteElment.innerText= "Delete";
    deleteElment.addEventListener("click", deleteCard);


    body.append(h5Element, h6Element, pElement,tempElement, editElment, deleteElment)
    card.append(image, body)

    return card
}

// function used to create elements, accepts element type, classes needed, and if innerText attributes exists then inserts needed info
function createElement(elementType, classes, innerText = "") {
    const tempElement = document.createElement(elementType);
    tempElement.className = classes;
    console.log(tempElement.hasAttribute("innerText"));
    if (innerText.length > 0) {
        tempElement.innerText = innerText;
    }
    console.log(innerText.length > 0);
    tempElement.innerText = innerText;
    return tempElement
}

// Function is called when the user clicks on edit, prompt user for changes in name or location and calls specific function
function editCardInfo(e) {
    let mainCard = e.target.parentNode.parentNode;
    let cardBody = e.target.parentNode;
    console.log(cardBody);
    console.log(cardBody.childNodes[3])
    let newDestination = prompt("Enter new name", "")
    let newLocation = prompt("Enter new location", "")
    updateName(cardBody, newDestination)
    updateLocation(cardBody, newLocation)
    updateTemperature(cardBody, newLocation)
    fetchRandomUrl(mainCard.childNodes[0], newDestination);
}

// Function used when the user clicks on the delete button
function deleteCard(e) {
    const cardNode = e.target.parentNode.parentNode;
    cardNode.remove();
    updateCardHeader();
}


// Function to update the name if user enters new item
function updateName(card, newName) {
    let element = card.childNodes[0];
    element.innerText = newName;
}

// function to update new location if user enter new info
function updateLocation(card, newLocation) {
    let element = card.childNodes[1];
    element.innerText = newLocation;
}

function updateTemperature(card, newLocation){
    let element = card.childNodes[3];
    getLocationWeather(element,newLocation);
}


//function that accepts a element and locationkeyword, uses fetch to get a random unsplash image using location as query parameter
function fetchRandomUrl(elem, query) {
    let updateApi = UNSPLASH_URL + query;
    fetch(updateApi).then((res) => res.json()).then((images) => {
        let index = generateRandomIndex(images.results.length)
        console.log(images.results)
        elem.src = images.results[index].urls.regular;
    });
}

//helper functionto help generate a random index based on the size of the array.
function generateRandomIndex(size) {
    return Math.floor(Math.random() * size)
}

//function which controls the header of the various Destination Cards, Changes title when no cards are present or when there is at least one card
function updateCardHeader(){
    if (destinationCards.hasChildNodes()) {
        isThereDestinationsCards = true;
    } else {
        isThereDestinationsCards =false;   
    } 
 
    headerElement.innerText = isThereDestinationsCards ? "My Wishlist" : "Enter destination details"
} 

//function that makes a fetch request to get the temperature based on location, 
function getLocationWeather(elem, location){
    let replaced = location.replace(" ", "%20")
    let updatedApi = OPEN_WEATHER_URL + replaced;
    fetch(updatedApi).then((res) => {
        console.log(res.ok)
        if (!res.ok) {
            throw Error(res.statusText)
        } else {
            return res.json();
        }
    }).then((weatherResult)=> {
        // console.log(weatherResult);
        console.log(weatherResult.main.temp);
        elem.innerText = "CurrentTemp: " + weatherResult.main.temp;
    }).catch((error) => {
        elem.innerText = "Current Temp: N/A"
    });
}

