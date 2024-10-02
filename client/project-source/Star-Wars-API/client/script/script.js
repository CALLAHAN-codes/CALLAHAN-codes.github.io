// init api url | init personList array | init sorted array
const url = "https://swapi.dev/api/people/?format=json"
let personList = []
let sortedPersonList = []
let planetData = []

// handle on load for main page
async function handleOnLoad(){

    await getPersonData()
    buildPersonsTable()
}

// handle build persons table
function buildPersonsTable(){
    // log
    console.log("Building Table...")

    // init content | show result count
    let html = `<table id="results">
    <colgroup>
        <col span="1" style="width: 30%;">
        <col span="1" style="width: 30%;">
        <col span="1" style="width: 30%;">
        <col span="1" style="width: 10%;">
    </colgroup>
    <tr>
        <th>Name</th>
        <th>Birth Year</th>
        <th>Planet</th>
        <th>Copy</th>
    </tr>`

    sortPersonsData()

    // for each sorted person
    sortedPersonList.forEach(person => {

        // add to table
        html += `<tr>
            <td>${person.name}</td>
            <td style="text-align: center">${person.birth_year}</td>
            <td><a class="btn" onclick="handleNewPlanetCall('${person.homeworld}')">Learn More</a></td>
            <td class="json-link"><a onclick="saveToClipboard('${person.name}')"><i class="fa-solid fa-clipboard-list"></i><a></td>
        </tr>`
    })

    // handle buttons
    if(personList.next == null){
        html += `<tr><td colspan="4" style="text-align:center; background-color: #5f1100;"><a onclick="handleNewPersonCall('${personList.previous}')" href="#results" style="cursor: pointer; color: white;"><strong><i class="fa-solid fa-arrow-left"></i> Prev</a></strong></td></tr>`
    } else if (personList.previous == null){
        html += `<tr><td colspan="4" style="text-align:center; background-color: #5f1100;"><a onclick="handleNewPersonCall('${personList.next}')" href="#results" style="cursor: pointer; color: white;"><strong>Next <i class="fa-solid fa-arrow-right"></i></a></strong></td></tr>`
    } else {
        html += `<tr><td colspan="4" style="text-align:center; background-color: #5f1100;"><a onclick="handleNewPersonCall('${personList.previous}')" href="#results" style="cursor: pointer; color: white;"><strong><i class="fa-solid fa-arrow-left"></i> Prev</a></a>&emsp;|&emsp;<a onclick="handleNewPersonCall('${personList.next}')" href="#results" style="cursor: pointer; color: white;">Next <i class="fa-solid fa-arrow-right"></a></strong></td></tr>`
    }

    // finish off table and add to html
    html += `</table>`

    document.getElementById('alert').innerHTML = `<p>Results Below<br><a href="#results"><i class="fa-solid fa-arrow-down icon"></i></a></p>`
    document.getElementById('app').innerHTML = html

    // log
    console.log("Table Built!")
}

// sort persons list alphabetically
function sortPersonsData(){
    // https://stackoverflow.com/questions/6712034/sort-array-by-firstname-alphabetically-in-javascript
    sortedPersonList = personList.results.sort((a, b) => a.name.localeCompare(b.name))
    console.log("List has been sorted alphabetically.")

    // log
    sortedPersonList.forEach(person => {
        console.log("\t- " + person.name)
    });
}

// get api data of persons
async function getPersonData(){

    // log
    console.log("Fetching...")
    
    // use initial url to get first list
    const response = await fetch(url)
    const data = await response.json()
    personList = data

    // log
    console.log(`\t- Initial link fetched: ${url}`)

    // log
    console.log(`All data has been fetched.`)
}

// load new persons api
async function handleNewPersonCall(url){

    // log
    console.log("Fetching...")

    // use initial url to get first list
    const response = await fetch(url)
    const data = await response.json()
    personList = data

    // sort data and build table
    sortPersonsData()
    buildPersonsTable()
}

// load new planet api 
async function handleNewPlanetCall(personPlanetURL){

    // clear local storage
    localStorage.clear();

    // log
    console.log("Storage Cleared.\nFetching...")

    // use person planet url to get data
    const response = await fetch(personPlanetURL)
    const data = await response.json()
    planetData = data

    // save to local storage
    let storage = JSON.stringify(planetData)
    localStorage.setItem("planetData_KEY", storage)

    // open url | https://stackoverflow.com/questions/8454510/open-url-in-same-window-and-in-same-tab
    window.open('client/pages/details.html', "_self");

}

// get planet data from storage
function getPlanetData(){

    // get key
    let planetDataKey = localStorage.getItem("planetData_KEY")

    // parse json
    let storedPlanet = JSON.parse(planetDataKey)

    let html = `<p>Name: ${storedPlanet.name}</p>
    <p>Climate: ${storedPlanet.climate}</p>
    <p>Population: ${storedPlanet.population}</p>`

    // foreach stored recipe
    document.getElementById('details-display').innerHTML = html

}

// saves person object to clipboard as formatted JSON
function saveToClipboard(personToSave){

    // for each person
    sortedPersonList.forEach(person => {

        // if person name = person passed in parameter
        if(person.name == personToSave){

            // stringify
            let personToString = JSON.stringify(person, null, 4)

            // Copy the text inside the text field
            navigator.clipboard.writeText(personToString)
                    
            // Alert the copied text
            alert(`${person.name}'s object data has been copied to your clipboard in formatted JSON.`)
        }
    })
}