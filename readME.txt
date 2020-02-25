Supply Frontend ReadMe

/dashboard
    # This will be the immediate page that the fleet manager will encounter after login. 
    # The components of it will be a welcome header, drawers that contain tables and actions buttons
    # and then a bulletin for urgents alerts and actions that need to be made for a particular fleet/vehicle
    /dashboard.html

/images
    # Not much to say here, just holds images that we'll be using

/js
    # As its name may imply, this is the logic that will generate all the neccessary tables DOMs for displaying all 
    # of a fleet managers fleet and the encapsulated vehicles
    /buildtables.js

    # Logic that allows us to have drawer style div blocks 
    # (credit: "https://www.w3schools.com/howto/howto_js_collapsible.asp")
    /collapsible.js

    # In here will live all the logic of the different button functionalities. 
    /fmactions.js

    # Logic that allows for sortable tables
    # (credit: "https://www.kryogenix.org/code/browser/sorttable/sorttable.js")

/login
    # Not much to say here, just our login page
    /login.html

/styling
    # Our dashboard.html specific CSS due to clever usage of certain tags that where otherwised
    # conformed to the UI guide.
    /dashboard.css

    # Site wide UI Style guide
    /style.css

    # Table specific styling
    /table.css