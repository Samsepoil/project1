<?php
    
    function updateRecord() {

        $servername = 'elvisdb';
        $username = 'penara57';
        $password = '1BLue8moUsE!';
        $databasename = 'penara57';
    
    
        //Connection to a database
        $connection = mysqli_connect($servername,$username,$password, $databasename); 

        //Store variables given
        $id = $_POST['update-id'];
        $accountName = $_POST['update-acc-name'];
        $accountFullName = $_POST['update-full-name'];

        //Set up table to update
        $sql = "UPDATE account_table SET
            accName = '$accountName', 
            fullName = '$accountFullName'
        
            WHERE accNum = '$id'
        ";

        $updateQuery = mysqli_query($connection, $sql); 

        if(!$updateQuery) { 
            //failed update
            echo 'Error : ' . $sql.mysqli_error($connection);
        }
        else {
            echo 'update successful';

        }

        //Close the connection
        mysqli_close($connection);

        //Redirect the User back to index.php
        header('location: admin.php');




    }


    if(isset($_POST['submit-update'])) {
        updateRecord();
    }



?>