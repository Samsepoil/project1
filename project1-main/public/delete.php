<?php
   

    function deleteRecord() {

        $servername = 'elvisdb';
        $username = 'penara57';
        $password = '1BLue8moUsE!';
        $databasename = 'penara57';
    

        //Connection to a database
        $connection = mysqli_connect($servername,$username,$password, $databasename); 

        //Store Acc ID
        $id = $_POST['delete-id'];

      
        $sql = "DELETE FROM account_table
            WHERE accNum = '$id'
        ";

        $deleteQuery = mysqli_query($connection, $sql); //exectue our SQL query

        if(!$deleteQuery) {
            //failed delete
            echo 'Error : ' . $sql.mysqli_error($connection);
        }
        else {
            echo 'Delete successful';

        }

        //Close the connection
        mysqli_close($connection);

        header('location: admin.php');




    }


    if(isset($_POST['submit-delete'])) { 
      deleteRecord();
    }



?>