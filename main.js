//primer paso traer los elementos del html
const input = document.querySelector(`.input-text`);
const addForm = document.querySelector(`.add-form`);
const tasksList = document.querySelector(`.tasks-list`);
const deleteBtn = document.querySelector(`.deleteAll-btn`);

//definimos todas las tareas, si existe un array de tareas en el localstorage nos va a traer esa lista, en caso de que no exista no va a traer un array vacio
let tasks = JSON.parse(localStorage.getItem(`tasks`))  || [];


//creamos la funcion para guardar las tareas en el local storage a medida que las vayamos agregando.


const saveLocalStorage = tasksList => {
    localStorage.setItem(`tasks`, JSON.stringify(tasksList));
}

//creamos una funcion que va a recibir una tarea y se va a encargar del renderizado de cada tarea individual.
//El data id lo vamos a ultilizar para eliminar una tarea
const createTask = task => 
    `<li>${task.name}<img class="delete-btn" src="./img/delete.svg" data-id=${task.taskId}></li>`;
;


//creamos la logica de renderizacion de la lista de tareas, va a recibir la lista de tareas y mediante el uso de map va a renderizar cada una de ellas usando createTask que la creamos previamente, por ultimo usamos el metodo join para evitar que aparezca una coma entre las tareas
const renderTasksList = todoList => {

tasksList.innerHTML = todoList.map(task => createTask(task)).join(` `);
};

//creamos la funcion para ocultar el boton de borrar las tareas si no hay ninguna en la lista
const hideDeleteAll = tasksList => {
    if(!tasksList.length){
        deleteBtn.classList.add(`hidden`);
        return;
    }
    deleteBtn.classList.remove(`hidden`);
};

// funcion para agregar tareas, e es un evento, con el preventDefault cancelamos el evento del submit por defecto que hace que se recargue la pagina
const addTask = e => {
    e.preventDefault();
    //guardar en una variable la tarea que ingresamos en el input y usamos el metodo trim para eliminar los espacios al principio y final.
    const taskName = input.value.trim();
    //console.log(taskName); mostramos por consola la tarea ingresada
    //le pasamos por condicion que si no hay ninguna tarea nos imprima un alert y depsues preguntamos si hay alguna tarea con ese nombre con el metodo some 
    if(!taskName.length){
        alert(`por favor ingresa una tarea`)
        return;
    } else if(
        tasks.some(task => task.name.toLowerCase() === taskName.toLowerCase())
        ){
            alert(`ya existe una tarea con ese nombre`);
            return;
        };


    //si pasa el proceso de verificacion copiamos el array vacio que tenemos para agregarle las tareas que ingresamos en el input, las agregamos a un objeto dandole un nombre y un id , hacemos el input.value para que cuando guardamos quede vacio nuevamente el input
tasks = [... tasks, {name: taskName, taskId: tasks.length + 1}];
input.value = " ";

//agregamos una funcion para que cuando ingresamos una tarea nos la pinte 
renderTasksList(tasks);

saveLocalStorage(tasks);
hideDeleteAll(tasks);

};

//creamos la funcion para borrar una tarea
//1. si el elemento que apretamos de la lista de tareas (osea el ul) no contiene la clase delete-btn no hacemos nada, por eso e return.
//2. creamos una variable en donde vamos a almacenar el id que filtraremos para borrar la tarea.
//3. filtramos la lista de tareas para que sea igual pero sin el elemento con el id de la variable anterior(filterId).
//4. renderizamos
//5.actualizamos el local storage
//6. verificamos si se tiene que borrar o no el boton de borrar todas las tareas
const removeTask = e => {
    if (!e.target.classList.contains('delete-btn')) return;
    const filterId = Number(e.target.dataset.id);
    tasks = tasks.filter(task => task.taskId !== filterId);
    renderTasksList(tasks);
    saveLocalStorage(tasks);
    hideDeleteAll(tasks);
  };


  //funcion para borrar todas las tareas
const removeAll = () => {
    tasks = [];
    renderTasksList(tasks);
    saveLocalStorage(tasks);
    hideDeleteAll(tasks);
};


// Creamos la funcion init para poner en un solo lugar las tareas a realizar y los eventos del DOM
// 1. Una vez que creemos la funcion para renderizar la lista de tareas, agregamos esta funcion para que se ejecute al principio. Para que si hay tareas dentro del localstorage las pinte.
// 2. Agregamos el evento addTask que se le va a asignar al formulario
// 3.Agregamos el evento removeTask al elemento taskList (ul)
// 4.Agregar el evento removeAll al boton deleteBtn
// . Verificamos si se tiene que ocultar o no el boton (Por si al cargar habia tareas en el localStorage)

const init = () => {
    renderTasksList(tasks);
    addForm.addEventListener(`submit`, addTask);
    tasksList.addEventListener(`click`, removeTask);
    deleteBtn.addEventListener(`click`,removeAll);
    hideDeleteAll(tasks);
};

init();

