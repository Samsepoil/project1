console.log("we have to do all this within a week? (╯°□°)╯︵ ┻━┻");
console.log("keep calm and sip on some tea we'll get through this - R");
console.log("make sure to hide all the things we've put in the page. these idiots in suits would never try to highlight random parts. - K");
console.log("everything is hidden thx 4 reminding me - R");


let currentIndex = 0;
var screenWidth = document.documentElement.clientWidth || window.innerWidth; 

      const images = [
        'jump.gif',
        'nature.gif',
        'businesshandshake.gif'
      ];
     

      function changeImage() {

          const slideshow = document.getElementById('slideshow'); 
          currentIndex = (currentIndex + 1) % images.length; 
          slideshow.style.opacity = 0; // Fade out 

          setTimeout(() => { 
              slideshow.src = images[currentIndex]; 
              slideshow.style.opacity = 1; // Fade in 
          }, 1000); // Wait for fade out to finish
      
      
      }

      setInterval(changeImage, 5000); // Change image every 5 seconds
     
/*Rad Pena submission*/ 
      
  

      


      
    


   
      




 
    
       
     
   