25/2/2022
2:54
Added buttons, they don't do anyting right now except for alerts. I've also been experimenting with accessing html tables at different levels
For example accessing the entire table itself, by row, column, cell and some combination of them each other
In addition, I added setAttribute of an id to each TD basically identifying them by their row and column pairing. This is because this will potentially allow us to just use 
document.getElementById('id) to access the cells instead of looping to search for them if things needs to be updated!