
require("./seedableRandom")

// start RNG
var m = new MersenneTwister();
console.log("seed = " + m.seed)



// split big string literal into a list
// declare if this will be indexed by 

// table = makeList(key=false, index='weight | range | undefined', key=false, content: string)
    // index determines if the table includes weight (x-in-sum(x's)), range (x or x-y on the roll) and/or a string key
    // [weight / range] [key (one word)] description
        // include error checking for overlaps in the ranges
    // if no range or weight is included, assume each line has a weight of 1


// random choice from list (with or without replacement, so card draw or dice roll)




// This is external JavaScript code
document.getElementById("resultDisplay").textContent = "Content added by external JavaScript!"



/** Parse content to create a table */
exports.makeTable = (content, index=undefined, key=false) => {
    table = {
        content: [],
    }

    return table
}

/** Random choice from table */
exports.pick = (table) => {
    const randomIndex = Math.floor(m.random() * table.content.length)

    return table.content[randomIndex]
}

