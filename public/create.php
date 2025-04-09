<?php

 
function createRecord() {

    $servername = 'elvisdb';
    $username = 'penara57';
    $password = '1BLue8moUsE!';
    $databasename = 'penara57';
        
    //Connection to a database
    $connection = mysqli_connect($servername,$username,$password, $databasename);

    //check to see if this connection has worked and successfull
    if(!$connection) {
        die ('Connection unsuccessful : ' . mysqli_connect_error());
    }
    else {
        echo 'Connection success!';
    }



    $accountName = $_POST['create-account'];
    $accountFullName = $_POST['create-full-name'];
    $routingNum = rand()%1000;
    $accountNumber = rand()%1000;


    $sql = "INSERT INTO account_table (accNum, accName, fullName, routingNum, accBal) 
        VALUES ('$accountNumber', '$accountName','$accountFullName','$routingNum', '1000')";

    //Check if inserting data was successful
    if(mysqli_query($connection,$sql)) {
        echo 'successfully inserted data';
    }
    else {
        echo 'Error: ' . $sql.mysqli_error($connection);
    }     


    mysqli_close($connection);



    header('location: admin.php');

}


if(isset($_POST['create-button'])) {
   createRecord();

}

?>