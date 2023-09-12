
        // Function to display an alert based on screen size

        PAGECONTROL=()=>{
            if (window.innerWidth >= 800) {
                
                // DISPLAY DESKTOP VIEW
                DESKTOPHOMEPAGE();

            } else {

                // DISPLAY MOBILE VIEW
                MOBILEHOMEPAGE();

            }
        }

        // Add an event listener for the resize event
        window.addEventListener('resize', PAGECONTROL);

       


