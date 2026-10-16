

const todoForm = document.getElementById('todoForm')
const userIdControl = document.getElementById('userId')
const todoControl = document.getElementById('todo')
const submitBtn = document.getElementById('submitBtn')
const updateBtn = document.getElementById('updateBtn')
const spinner = document.getElementById('spinner')
const todoList = document.getElementById('todoList')

const BASE_URL = `https://student-crud-26d0f-default-rtdb.firebaseio.com/2nd%20todo%20crud%20fetch%20promise%20with%20genric/3d%20todo%20crud%20fetch%20promise%20with%20genric`;
const TODO_URL = `${BASE_URL}/todos.json`

function snackbar(msg, icon){
    Swal.fire({
        title: msg,
        icon: icon,
        timer: 3000
    })
}

function showSpinner(){
    spinner.classList.remove('d-none')
}
function hideSpinner(){
    spinner.classList.add('d-none')
}

const state = {
    todoArr:[],
    editId:null,
}

// READ TODO FUNCTIONALITY
function onCreateTodoList(arr){
    let result =``;
    arr.forEach(ele=>{
        result +=`<tr id="${ele.id}">
                        <td>${ele.userId}</td>
                        <td>${ele.todo}</td>
                        <td class="text-center">
                            <button onclick="editTodo(this)" class="btn btn-sm btn-success">Edit</button>
                        </td>
                        <td class="text-center">
                            <button onclick="deleteTodo(this)" class="btn btn-sm btn-danger">Remove</button>
                        </td>
                    </tr>`
    })
    todoList.innerHTML = result;
}

function fetchTodo(){
    showSpinner()
    fetch(TODO_URL,{
        method:"GET",
        body:null,
        headers:{
            "Content-type":"application/json",
            "Authorization":"TOKEN JWT form LS",
        }
    })
   .then(res=>{
        if(!res.ok){
            throw new Error('Failed to fetch todos')
        }
        return res.json()
    })
   .then(data=>{
        if(data){
            for(const key in data){
                data[key].id = key
                state.todoArr.unshift(data[key])
            }
            onCreateTodoList(state.todoArr)
        }
    })
   .catch(err=>{
        snackbar(err.message, 'error')
    })
   .finally(()=>{
        hideSpinner()
    })
}
fetchTodo()

// CREATE TODO FUNCTIONALITY
function onAddTodo(eve){
    eve.preventDefault()
    let todoObj={
        userId: userIdControl.value,
        todo: todoControl.value,
    }
    if(!todoObj.userId ||!todoObj.todo){
        snackbar('Both fields are required', 'warning')
        return
    }
    showSpinner()
    fetch(TODO_URL,{
        method:"POST",
        body:JSON.stringify(todoObj),
        headers:{
            "Content-type":"application/json",
            "Authorization":"TOKEN JWT form LS",
        }
    })
   .then(res=>{
        if(!res.ok){
            throw new Error()
        }
        return res.json()
    })
   .then(data=>{
        todoObj.id = data.name
        state.todoArr.unshift(todoObj)
        todoForm.reset()
        let tr = document.createElement('tr')
        tr.id = todoObj.id;
        tr.innerHTML = `
                        <td>${todoObj.userId}</td>
                        <td>${todoObj.todo}</td>
                        <td class="text-center">
                            <button onclick="editTodo(this)" class="btn btn-sm btn-success">Edit</button>
                        </td>
                        <td class="text-center">
                            <button onclick="deleteTodo(this)" class="btn btn-sm btn-danger">Remove</button>
                        </td>`

        todoList.prepend(tr)
        snackbar('Todo Created successfully!!!', 'success')
    })
   .catch(err=>{
        snackbar('Failed to add todo!!!', 'error')
        cl(err)
    })
   .finally(()=>{
        hideSpinner()
    })
}

// EDIT TODO FUNCTIONALITY
function editTodo(ele){
    let editId = ele.closest('tr').id;
    state.editId = editId;
    let EDIT_URL = `${BASE_URL}/todos/${editId}.json`
    showSpinner()
    fetch(EDIT_URL,{
        method:"GET",
        body:null,
        headers:{
            "Content-type":"application/json",
            "Authorization":"TOKEN JWT form LS",
        }
    })
   .then(res=>{
        if(!res.ok){
            throw new Error()
        }
        return res.json()
    })
   .then(res=>{
        userIdControl.value = res.userId;
        todoControl.value = res.todo;
        submitBtn.classList.add('d-none')
        updateBtn.classList.remove('d-none')
    })
   .catch(err=>{
        snackbar(err.message, 'error')
    })
   .finally(()=>{
        hideSpinner()
    })
}

// UPDATE TODO FUNCTIONALITY
function onUpdateTodo(){
    let update_Id = state.editId;
    let UPDATE_URL = `${BASE_URL}/todos/${update_Id}.json`;
    let updateObj={
        userId: userIdControl.value,
        todo: todoControl.value,
        id:update_Id,
    }
    showSpinner()
    fetch(UPDATE_URL,{
        method:"PATCH",
        body:JSON.stringify(updateObj),
        headers:{
            "Content-type":"application/json",
            "Authorization":"TOKEN JWT form LS",
        }
    })
   .then(res=>{
        if(!res.ok){
            throw new Error()
        }
        return res.json()
    })
   .then(data=>{
        let getIndex = state.todoArr.findIndex(g=>g.id === update_Id);
        state.todoArr[getIndex]=updateObj;
        let tr = document.getElementById(update_Id);
        tr.innerHTML = `<td>${updateObj.userId}</td>
                        <td>${updateObj.todo}</td>
                        <td class="text-center">
                            <button onclick="editTodo(this)" class="btn btn-sm btn-success">Edit</button>
                        </td>
                        <td class="text-center">
                            <button onclick="deleteTodo(this)" class="btn btn-sm btn-danger">Remove</button>
                        </td>`
                    todoForm.reset()
                    submitBtn.classList.remove('d-none')
                    updateBtn.classList.add('d-none')
                    snackbar(`Your Todo updated Successfully!!!`, 'success')

    })
   .catch(err=>{
        snackbar('Failed to update todo!!!', 'error')
        cl(err)
    })
   .finally(()=>{
        hideSpinner()
    })
}

// DELETE TODO FUNCTIONALITY
function deleteTodo(ele){
    let removeId = ele.closest('tr').id;
    let REMOVE_URL = `${BASE_URL}/todos/${removeId}.json`;
    Swal.fire({
      title: "Are you sure, you want to delete this todo?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    })
   .then((result)=>{
        if(result.isConfirmed){
            showSpinner()
            fetch(REMOVE_URL,{
                method:"DELETE",
                body:null,
                headers:{
                    "Content-type":"application/json",
                    "Authorization":"TOKEN JWT form LS",
                }
            })
           .then(res=>{
                if(!res.ok){
                    throw new Error()
                }
            })
           .then(data=>{
                let getIndex = state.todoArr.findIndex(j=>j.id === removeId)
                state.todoArr.splice(getIndex, 1)
                ele.closest('tr').remove()
                snackbar('Todo Deleted Successfully!!!', 'success')
            })
           .catch(err=>{
                snackbar(err.message, 'error')
                cl(err)
            })
           .finally(()=>{
                hideSpinner()
            })
        }
    })
}

todoForm.addEventListener('submit', onAddTodo)
updateBtn.addEventListener('click', onUpdateTodo)