let createButton = document.getElementById('create-button');
let createForm = document.getElementById('create-form');
let isCreateFormDisplaying = false;

let updateButton = document.getElementById('update-button');
let updateForm = document.getElementById('update-form');
let isUpdatingFormDisplaying = false;

let deleteButton = document.getElementById('delete-button');
let deleteForm = document.getElementById('delete-form');
let isDeleteFormDisplaying = false;

//Toggle
createButton.onclick = function() {

    console.log('function working...');   
    
    if(isCreateFormDisplaying == false) {

        createForm.style.display = 'block';
        isCreateFormDisplaying = true;

    }
    else {
        //hide the form
        createForm.style.display = 'none';
        isCreateFormDisplaying = false;
    }

}


//Toggle
updateButton.onclick = function() {

    console.log('function working...');   
    
    if(isUpdatingFormDisplaying == false) {

        updateForm.style.display = 'block';
        isUpdatingFormDisplaying = true;


    }
    else {
        //hide the form
        updateForm.style.display = 'none';
        isUpdatingFormDisplaying = false;

    }

}


//Toggle
deleteButton.onclick = function() {

    console.log('function working...');   
    
    if(isCreateFormDisplaying==false) {

        deleteForm.style.display = 'block';
        isCreateFormDisplaying = true;

    }
    else {
        //hide form
        deleteForm.style.display = 'none';
        isCreateFormDisplaying = false;
    }

}

/*Rad Pena submission*/