var tasks = {};

var createTask = function (taskText, taskDate, taskList) {
    // create elements that make up a task item
    var taskLi = $("<li>").addClass("list-group-item");
    var taskSpan = $("<span>")
        .addClass("badge badge-primary badge-pill")
        .text(taskDate);
    var taskP = $("<p>")
        .addClass("m-1")
        .text(taskText);

    // append span and p element to parent li
    taskLi.append(taskSpan, taskP);


    // append to ul list on the page
    $("#list-" + taskList).append(taskLi);
};

var loadTasks = function () {
    tasks = JSON.parse(localStorage.getItem("tasks"));

    // if nothing in localStorage, create a new object to track all task status arrays
    if (!tasks) {
        tasks = {
            toDo: [],
            inProgress: [],
            inReview: [],
            done: []
        };
    }

    // loop over object properties
    $.each(tasks, function (list, arr) {
        console.log(list, arr);
        // then loop over sub-array
        arr.forEach(function (task) {
            createTask(task.text, task.date, list);
        });
    });
};

var saveTasks = function () {
    localStorage.setItem("tasks", JSON.stringify(tasks));
};





// modal was triggered
$("#task-form-modal").on("show.bs.modal", function () {
    // clear values
    $("#modalTaskDescription, #modalDueDate").val("");
});

// modal is fully visible
$("#task-form-modal").on("shown.bs.modal", function () {
    // highlight textarea
    $("#modalTaskDescription").trigger("focus");
});

// save button in modal was clicked
$("#task-form-modal .btn-primary").click(function () {
    // get form values
    var taskText = $("#modalTaskDescription").val();
    var taskDate = $("#modalDueDate").val();

    if (taskText && taskDate) {
        createTask(taskText, taskDate, "toDo");

        // close modal
        $("#task-form-modal").modal("hide");

        // save in tasks array
        tasks.toDo.push({
            text: taskText,
            date: taskDate
        });

        saveTasks();
    }
});

// remove all tasks
$("#remove-tasks").on("click", function () {
    for (var key in tasks) {
        tasks[key].length = 0;
        $("#list-" + key).empty();
    }
    saveTasks();
});

$(".list-group").on("click", "p", function () {
    var text = $(this).text().trim();

    var textInput = $("<textarea>")
        .addClass("form-control")
        .val(text);

    $(this).replaceWith(textInput);

    textInput.trigger("focus");
});


$(".list-group").on("blur", "textarea", function () {
    //GET THE TEXTAREA CURRENT 'TEXT/VALUE'
    var text = $(this)
        .val()
        .trim();

    //GET THE PARENT UL'S ID ATTRIBUTE
    var status = $(this)
        .closet(".list-group")
        .attr("id")
        .replace("list-", "");

    //GET THE TASK'S POSITION IN THE LIST OF OTHER 'li' ELEMENTS
    var index = $(this)
        .closet(".list-group-item")
        .index();

    tasks[status][index].text = text;
    saveTasks();

    //RECREATE 'p' ELEMENT
    var taskP = $("<p>")
        .addClass("m-1")
        .text(text);

    //REPLACE 'textarea' WITH 'p'
    $(this).replaceWith(taskP);
});

//'due date' WAS CLICKED
$(".list-group").on("click", "span", function () {
    //GET CURRENT TEXT
    var date = $(this)
        .text()
        .trim();

    //CREATE NEW INPUT ELEMENT 
    var dateInput = $("<input>")
        .attr("type", "text")
        .addClass("form-control")
        .val(date);

    //SWAP OUT ELEMENTS
    $(this).replaceWith(dateInput);

    //AUTOMATICALLY FOCUS ON NEW ELEMENT
    dateInput.trigger("focus");

});

//VALUE OF DUE DATE WAS CHANGED
$(".list-group").on("blur", "input[type='text']", function () {
    //GET CURRENT TEXT
    var date = $(this)
        .val()
        .trim();

    //GET THE PARENT ul's ID ATTRIBUTE
    var status = $(this)
        .closet(".list-group")
        .attr("id")
        .replace("list-", "");

    //GET THE 'task's' POSITION IN THE LIST OF OTHER 'li' ELEMENTS
    var index = $(this)
        .closet(".list-group-item")
        .index();

    //UPDATE TASK IN []ARRAY AND RE-SAVE TO 'localStorage"
    tasks[status][index].date = date;
    saveTasks();

    //RECREATE SPAN ELEMENT WITH BOOSTRAP CLASSES
    var taskSpan = $("<span>")
        .addClass("badge badge-primary badge-pill")
        .text(date);

    //REPLACE INPUT WITH SPAN ELEMENT 
    $(this).replaceWith(taskSpan);
});