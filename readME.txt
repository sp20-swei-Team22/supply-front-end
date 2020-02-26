Supply Frontend ReadMe

Functionality and Connections: (Will have the same content in the /supply-back-end/readMe.txt, so can skip this part if you already read that)
User will open start at our login.html, after credential validation, they are redirected to our dashboard.html. 
Onload, our dashboard will make a GET request to our fleetHandler(not implemented as of this current update) to fetch 
fleet data and vehicles of said fleet(s) and load them into our table(s). 
From there the user will be able to see tables of their fleet(s) and a bulletin that will display
potentially urgent messages and quickfixes that may need their attention

1.  Login (input credentials)
2.  Credential validation (input is POSTed to login.py to check DB)
3a. Fail, (reprompt credentials)
3b. Pass, (redirected to dashboard.html)
4.  Dashboard (onload will make GET request for fleet manager's fleet info to populate tables and bulletin)

File Structure:
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