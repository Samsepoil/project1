Welcome Professor!

To begin this project, begin by cloning the entire repository. You will then want to run "npm install mongoose" to install mongoose for use wtih the web app. Then, run "mongorestore --db ecorp_bank dump/ecorp_bank/" to download the databse with current data for use. Finally run node app.mjs to start the web server and connect the database. Make sure you're in the correct folder, as sometimes even I mess up and end up in the wrong one.  

The local address to access the site is http://localhost:1234/  

Other than that, you can just explore! 

You can login with seeded user to explore or register yourself to create a new user and apply. Registration is able to catch and block creation of user already in database. 

There are a few seeded test users setup for use of login, dashboard view, and access to the application page.

username: tyrell.wellick 
password: password123

username: phillip.price 
password: password123

username: angela.moss
password: pasword123

The appliction link will lead you to our main point within the project, which is being able to apply to loans and credit cards! Credit Card tiers, credit limits, loan amounts, and interest rates are all feed into a calculation,
and are directly correlated to income and credit score input on the application.
It is behind a requireAuth command, so you must be signed into user account to reach the application page; it will properly redirect top login page if not currently logged in with session. 

You can fill out an application and it is fully written to catch errors to not allow submission until all criteria is met. It will prompt with successful submission if filled out properly and submitted.  

The withdraw/deposit link will take you to a page to be able to edit the balnace of the bank acocunt of the current logged in user. The balance will display in real time and reflect changes when returned to the dahsboard with transactions. 
 
We are also currently working on implementing more ARG themes, as that is a more predominate CSS and small script functions, and we want to make sure the databases work completely and well before focusing on looks and fun little interactables!  
As well, the "Transfer Money" and "Make Payments" links on a user dashboard page are incomplete and will not properly route at the moment. That is the area that we wanted to explore next had we had more time to complete.

Thanks for trying out our project! We're very happy with how complete and somewhat robust our app is to handle user navigation with templates, routes, redirects, and requireAuth.   

- Rad & Adam
