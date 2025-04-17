<!DOCTYPE html>
    <head>
        <title>Admin Account Management</title>
        <link rel="stylesheet" href="admin.css">

    </head>
    <body>

    <div id="main-holder">
    <div>

    <h1>Admin Account Manager</h2>

    </div>



        <?php require_once 'create.php';  
 
            //Lets take the connection infor from CREATE 
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
                echo 'SQL Server connection successful.';
            }
            

            $sql = "SELECT * FROM account_table"; //setup our query

            //query the database
            $result = mysqli_query($connection,$sql); //store into result
            $rowCount = mysqli_num_rows($result); 

    
            if($rowCount > 0) {
                echo "
                    <table> 
                       <thead>
                        <tr>
                          <th>Account Name</th>
                            <th>Full Name</th>
                            <th>Routing Number</th>
                            <th>Account Number</th>
                            <th>Account Balance</th>
                        </tr>
                       </thead>                     
                ";
            }
        ?>

     
        <?php
            while($row = $result->fetch_assoc()):  //will return value of records of each row
        ?>
            <tr>
                <td><?php echo $row['accName'] ?></td>
                <td><?php echo $row['fullName'] ?></td>
                <td><?php echo $row['routingNum'] ?></td>
                <td><?php echo $row['accNum'] ?></td>
                <td><?php echo $row['accBal'] ?></td>
            </tr>
        <?php endwhile ?>

            </table>         


       
        

        <div class="content-wrapper">
            <button id="create-button">Create Account</button>
            <button id="update-button">Update Account</buton>
            <button id="delete-button">Delete Account</button>
        
      
            <form action="create.php" method="POST" id="create-form">
                <input type="text" placeholder="Enter what you'd like your account name to be." name="create-account"/><br/>
                <input type="text" placeholder="Enter your full name, placing a space between each name." name="create-full-name"/><br/>

                <input type="submit" value="Save" name="create-button" class="small-button"  />
            </form>



            <form action="update.php" method="POST" id="update-form">
                <input type="text" placeholder="Enter account id" name="update-id"/><br/>
                <input type="text" placeholder="Enter the new account name for your account" name="update-acc-name"/><br/>
                <input type="text" placeholder="Enter your new full name." name="update-full-name"/><br/>
                <input type="submit" value="Save" name="submit-update" class="small-button"  />
            </form>

     
            <form action="delete.php" method="POST" id="delete-form">
            <input type="text" placeholder="Enter your account number. This should be on listed when you log in to your account." name="delete-id"/><br/>
              
                <input type="submit" value="Save" name="submit-delete" class="small-button" />
        
            </form>
           
            </form>



    
        </div>


     
        </div>   
        <script src="admin.js"></script>

    </body>
</html>