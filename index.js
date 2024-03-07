const addNewTaskButton = document.getElementById("addNewTask")
const home_content = document.querySelector("#home_content") //rename to taskContent
const taskMenu = document.querySelector("#menu")
const taskForm = document.querySelector("#form-div") //check if these two forms can be only one
const form = document.querySelector("#form")

const container = document.querySelector("#container") //if only for blur maybe rename to blurContainer?
const body = document.querySelector("body")
const descriptions = document.querySelector(".descriptions")
const edit = document.querySelector(".edit-div")
const homeButton = document.querySelector("#home")
const todayButton = document.querySelector("#today")
const weekAheadButton = document.querySelector("#week")

let taskArray = []

//localStorage.setItem("tasks", JSON.stringify(arrayParsed))
const localStorageTasks = localStorage.getItem("tasks")
if (localStorageTasks != null ) {
    taskArray = JSON.parse(localStorageTasks)
}

//TODO Uncomment if wanting to overwrite local storage tasks with default ones
//const taskArray = []

addNewTaskButton.addEventListener("pointerdown", (e) => {
    setVisible(true, taskForm)
    setBlurElement(true)
})

function saveTasksToLocalStorage () {
    localStorage.setItem("tasks", JSON.stringify(taskArray))
}

form.addEventListener("submit", (e)=>{
    
    const title = document.querySelector("#title").value
    const description = document.querySelector("#description").value
    const date = document.querySelector("#date").value
    const identificator = Date.now()
    const task = createNewTaskAndPushArray(title, description, date, identificator, false)
    renderTasks(task)
    setVisible(false, taskForm)
    setBlurElement(false)
    e.preventDefault()
})

function createNewTaskAndPushArray (title, description, date, uniqueId, isChecked ) {
    let task = new TaskConstructor (title, description, date, uniqueId, isChecked)
    taskArray.push(task)
    saveTasksToLocalStorage ()
    return taskArray;
}
let idIndex = 0
function createCheckBox () {
    let createDiv = document.createElement("div")
    let newCheckBox = document.createElement("input")
    let newLabel = document.createElement("label")
    createDiv.id = "inputCheckout"
    newCheckBox.type = "checkbox"
    newCheckBox.id = `checkbox${idIndex}`
    newCheckBox.classList.add("css-checkbox")
    newLabel.htmlFor = `checkbox${idIndex}`
    newCheckBox.label = ""
    newLabel.addEventListener("pointerdown", (e)=>{
        onCheckboxPointerDown(e)
    })
    createDiv.appendChild(newCheckBox)
    createDiv.appendChild(newLabel)
    idIndex+=1
    
    return createDiv    
}

function renderTasks (array) {
    home_content.innerHTML= ""
    home_content.classList.add("tasks")
    home_content.classList.remove("notes")
    array.forEach(element => {
        const newEle = document.createElement("li")
        const title = document.createElement("span")
        const desc = document.createElement("p")
        title.id = element.uniqueId
        desc.innerHTML = element.description
        desc.classList.add("hidden")
        desc.classList.add("absolute")
        title.innerHTML = element.title
        newEle.appendChild(title)
        newEle.appendChild(desc)
        home_content.appendChild(newEle)
        let checkbox = createCheckBox()
        newEle.appendChild(checkbox)
        const date = document.createElement("li")
        const eraseButton = createEraseButton(newEle)
        const editButton = createEditButton(newEle)
        newEle.addEventListener("pointerdown", (e)=>{
            if (e.target != checkbox && e.target != eraseButton && e.target != editButton){
                const title = e.target.parentNode.querySelector("span").innerHTML
                const desc = e.target.parentNode.querySelector("p").innerHTML
                seeDescription(title, desc)
                setVisible(true, descriptions)
                setBlurElement(true)
                // let a = newEle.getElementsByTagName("div")
                // setVisible(true, a[0])
            }
            
        })
    });
}

function createEditButton (newEle){
    const editButton = document.createElement("button")
    editButton.innerHTML = "Edit"
    editButton.classList.add("edit")
    editButton.addEventListener("pointerdown", (e)=>{
        editForm(e)
        setVisible(true, edit)
        setBlurElement(true)
    })
    newEle.appendChild(editButton)
    return editButton
}

function editForm (e){
    let task = taskArray[findIndexfromArray(e)]
    console.log(task)
    const editedTitle = document.querySelector("#edited-title")
    const editedDesc = document.querySelector("#edited-desc")
    const editedButton = document.querySelector("#send-edit")
    editedTitle.value = task.title
    editedDesc.value = task.description
    function forListener() {
        task.title = editedTitle.value
        task.description = editedDesc.value
        saveTasksToLocalStorage ()
        renderTasks(taskArray)
        setVisible(false, edit)
        setBlurElement(false)
        editedButton.removeEventListener("pointerdown", forListener)
    }
    
    editedButton.addEventListener("pointerdown", forListener
    )
}

function createEraseButton (newEle) {
    const erase = document.createElement("button")
    erase.innerHTML = "Borrar"
    erase.classList.add("erase")
    erase.addEventListener("pointerdown", (e)=>{
        // home_content.removeChild(e.target.parentNode)
        eraseFormList(e)
    })
    newEle.appendChild(erase)
    return erase ;
}

function eraseFormList (e) {
    let ee = findIndexfromArray (e)
    taskArray.splice(ee, 1)
    saveTasksToLocalStorage ()
    renderTasks(taskArray)
}

function findIndexfromArray (e) {
    let identificator = e.target.parentNode.querySelector("span").id
    const sameTitle = (element) => element.uniqueId == identificator
    let index = taskArray.findIndex(sameTitle)
    return index

}

function onCheckboxPointerDown (e) {
    let checkboxChecked = document.querySelector(`#${e.target.htmlFor}`)
    strikethrough(checkboxChecked.checked, e)
}

function strikethrough (boolean, b) {
    console.log(b)
    let parentDiv = b.querySelector("span");
    if (boolean){
        parentDiv.style.textDecoration = "none" 
    } else {
        parentDiv.style.textDecoration = "line-through"
    }
    
 }

class TaskConstructor {
    constructor (title, description, date, uniqueId, isChecked){
        this.title = title;
        this.description = description;
        this.date = date
        this.uniqueId = uniqueId
        this.isChecked = isChecked
    }
}

function seeDescription (title, desc){
    console.log("Entraque")
    setVisible(true, descriptions)
    descriptions.querySelector("h1").innerHTML = title
    descriptions.querySelector("p").innerHTML = desc
    function clickOutside (e) {
        if (e.target !== descriptions && !descriptions.contains(e.target)){
            setBlurElement(false)
            setVisible(false, descriptions)
           
        } else {
            console.log("nova")
        } 
        window.removeEventListener("pointerdown", clickOutside)
    }
    setTimeout(()=> {
        console.log("Entraque2")
        window.addEventListener("pointerdown", (e)=>{
            clickOutside(e)
        })
     }
     ,200)
}

function setVisible (boolean, item) {
    if (boolean) {
        item.classList.remove("hidden")
        item.classList.add("visible")
    } else {
        item.classList.remove("visible")
        item.classList.add("hidden")
    }
}

function setBlurElement (enabled) {
    if (enabled){
        container.classList.remove("not-blurry")
        container.classList.add("blurry")
    } else {
        container.classList.remove("blurry")
        container.classList.add("not-blurry")
    }
}

todayButton.onclick = renderToday
homeButton.onclick = renderAll
weekAheadButton.onclick = renderWeek 

function renderAll () {
    renderTasks(taskArray)
}
function renderWeek () {
    let thisWeek = taskArray.filter((task)=> daysAhead(task.date, 7))
    renderTasks(thisWeek)
}

function renderToday() {
    let onlyToday = taskArray.filter((task)=> daysAhead(task.date, 1))
    renderTasks(onlyToday)

}

function daysAhead(taskDay, daysAhead) {
    let fecha = new Date(taskDay)
    let today = new Date(new Date().toDateString())
    let weekLaterDate = new Date(new Date().toDateString())
    weekLaterDate.setDate(today.getDate() + daysAhead)
    return fecha >= today && fecha <= weekLaterDate
}
const notesArray = [
    {title: "Hola", description:"Como estas?"},
    {title: "Hello", description:"Me llamo Paco Romulano"},
    {title: "Hello", description:"How are you?"},
    {title: "Hello", description:"How are you?"},
    {title: "Hello", description:"How are you?"},
    {title: "Hello", description:"How are you?"},
    {title: "Hello", description:"How are you?"},
    {title: "Hello", description:"How are you?"},
]
function renderNotes() {
    home_content.innerHTML= ""
    home_content.classList.remove("tasks")
    home_content.classList.add("notes")
    notesArray.forEach((element)=>{
        let title = document.createElement("h1")
        let desc = document.createElement("p")
        let note = document.createElement("div")
        title.innerHTML = element.title
        desc.innerHTML = element.description
        note.appendChild(title)
        note.appendChild(desc)
        home_content.appendChild(note)

    })
}
notes.onclick = renderNotes

renderAll()