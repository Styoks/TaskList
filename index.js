const addNewTaskButton = document.getElementById("addNewTask")
const home_content = document.querySelector("#home_content") //rename to taskContent
//add taskMenu
const taskForm = document.querySelector("#form-div") //check if these two forms can be only one
const form = document.querySelector("#form")

const container = document.querySelector("#container") //if only for blur maybe rename to blurContainer?
const body = document.querySelector("body")
const descriptions = document.querySelector(".descriptions")
const edit = document.querySelector(".edit-div")
const homeButton = document.querySelector("#home")
const todayButton = document.querySelector("#today")
const weekAheadButton = document.querySelector("#week")

addNewTaskButton.addEventListener("pointerdown", (e) => {
    setVisible(true, taskForm)
    setBlurElement(true)
})

form.addEventListener("submit", (e)=>{
    const title = document.querySelector("#title").value
    const description = document.querySelector("#description").value
    const date = document.querySelector("#date").value
    const task = createNewTaskAndPushArray(title, description, date)
    renderTasks(task)
    setVisible(false, taskForm)
    setBlurElement(false)
    e.preventDefault()
})

function createNewTaskAndPushArray (title, description, date) {
    let task = new TaskConstructor (title, description, date)
    taskArray.push(task)
    return taskArray;
}

function createCheckBox () {
    let createDiv = document.createElement("div")
    let newCheckBox = document.createElement("input")
    let newLabel = document.createElement("label")
    createDiv.id = "inputCheckout"
    newCheckBox.type = "checkbox"
    newCheckBox.id = "checkboxx"
    newCheckBox.classList.add("css-checkbox")
    newLabel.htmlFor = "checkboxx"
    newCheckBox.label = ""
    newLabel.addEventListener("pointerdown", (e)=>{
        onCheckboxPointerDown(e)
    })
    createDiv.appendChild(newCheckBox)
    createDiv.appendChild(newLabel)
    
    return createDiv    
}

const taskArray = [
    { title: "Cleaning day!", description: "Clean the bathroom", date: "2024-03-19" },
    { title: "Walking", description: "Minimum 10 min!", date: "2024-02-22" },
    { title: "Pick the groceries", description: "Or not.... zzz", date: "2024-02-29" }

]


function renderTasks (array) {
    home_content.innerHTML= ""
    array.forEach(element => {
        const newEle = document.createElement("li")
        const title = document.createElement("span")
        const desc = document.createElement("p")
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
        // newEle.addEventListener("pointerdown", (e)=>{
        //     if (e.target != checkbox && e.target != eraseButton && e.target != editButton){
        //         const title = e.target.parentNode.querySelector("span").innerHTML
        //         const desc = e.target.parentNode.querySelector("p").innerHTML
        //         seeDescription(title, desc)
        //         setVisible(true, descriptions)
        //         setBlurElement(true)
        //         // let a = newEle.getElementsByTagName("div")
        //         // setVisible(true, a[0])
        //     }
            
        // })
    });
}

function createEditButton (newEle){
    const editButton = document.createElement("button")
    editButton.innerHTML = "Edit"
    editButton.id = "edit"
    editButton.addEventListener("pointerdown", (newEle)=>{
        editForm(newEle)
        setVisible(true, edit)
        setBlurElement(true)
    })
    newEle.appendChild(editButton)
    return editButton
}

function editForm (e){
    const editedTitle = document.querySelector("#edited-title")
    const editedDesc = document.querySelector("#edited-desc")
    const editedButton = document.querySelector("#send-edit")
    editedTitle.value = e.target.parentNode.querySelector("span").innerHTML
    editedDesc.value = e.target.parentNode.querySelector("p").innerHTML
    editedButton.addEventListener("pointerdown", ()=> {
        e.target.parentNode.querySelector("span").innerHTML = editedTitle.value
        e.target.parentNode.querySelector("p").innerHTML = editedDesc.value
        setVisible(false, edit)
        setBlurElement(false)
    })
}

function createEraseButton (newEle) {
    const erase = document.createElement("button")
    erase.innerHTML = "Borrar"
    erase.id = "erase"
    erase.addEventListener("pointerdown", (e)=>{
        // home_content.removeChild(e.target.parentNode)
        eraseFormList(e)
    })
    newEle.appendChild(erase)
    return erase ;
}

function eraseFormList (e) {
    let title = e.target.parentNode.querySelector("span").innerHTML
    let desc = e.target.parentNode.querySelector("p").innerHTML
    const sameTitle = (element) => element.title == title && element.description == desc
    let index = taskArray.findIndex(sameTitle)
    taskArray.splice(index, 1)
    renderTasks(taskArray)
}

function onCheckboxPointerDown (e) {
    console.log(e)
    strikethrough(e.target.checked, e)
}

function strikethrough (boolean, b) {
    let parentDiv = b.target.parentNode.querySelector("span");
    if (boolean){
        parentDiv.style.textDecoration = "none" 
    } else {
        parentDiv.style.textDecoration = "line-through"
    }
    
 }

class TaskConstructor {
    constructor (title, description, date){
        this.title = title;
        this.description = description;
        this.date = date
    }
}

function seeDescription (title, desc){
    descriptions.querySelector("h1").innerHTML = title
    descriptions.querySelector("p").innerHTML = desc
    window.addEventListener("pointerdown", (e)=>{
        if (e.target != descriptions){
            console.log("Adios")
            setBlurElement(false)
            setVisible(false, descriptions)
        } else {
            console.log("HOLA")
        }
    })
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
    let today = new Date()
    for (var i = 0; i < daysAhead; i++){
        
        if(today.getFullYear() == fecha.getFullYear() && 
        today.getMonth() == fecha.getMonth() && 
        today.getDate() == fecha.getDate())
        {
            return true
        } else {
            today.setDate(today.getDate() + 1)
        }
    }
}