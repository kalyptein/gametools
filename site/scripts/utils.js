
const rand = require("./seedableRandom")

// start RNG
var m = new rand.MersenneTwister();
console.log("seed = " + m.seed)


exports.tables = {};

const WEIGHT = 'weight'
const RANGE = 'range'

// split big string literal into a list
// declare if this will be indexed by 

// table = makeList(key=false, index='weight | range | undefined', key=false, content: string)
    // index determines if the table includes weight (x-in-sum(x's)), range (x or x-y on the roll) and/or a string key
    // [weight / range] [key (one word)] description
        // include error checking for overlaps in the ranges
    // if no range or weight is included, assume each line has a weight of 1


// This is external JavaScript code
// document.getElementById("resultDisplay").textContent = "Content added by external JavaScript!"



const keyRegex =              new RegExp(`^([A-Za-z0-9_\\-]+)\\s+(.+)$`)                                    // textKey rest of line is description                   key the rest is description
const weightRegex =           new RegExp(`^([0-9]+)\\s+(.+)$`)                                              // weightNumber rest of line is description              3 the rest is description
const weightAndKeyRegex =     new RegExp(`^([0-9]+)\\s+([A-Za-z0-9_\\-]+)\\s+(.+)$`)                        // weightNumber textKey rest of line is description      3 key the rest is description
const rangeRegex =            new RegExp(`^(-?[0-9]+)\\s*:\\s*(-?[0-9]+)\\s+(.+)$`)                         // x:y rest of line is description                       2:7 the rest is description
const rangeAndKeyRangeRegex = new RegExp(`^(-?[0-9]+)\\s*:\\s*(-?[0-9]+)\\s+([A-Za-z0-9_\\-]+)\\s+(.+)$`)   // x-y textKey rest of line is description               2:7 key the rest is description

/** Parse content to create a table (index = 'weight' | 'range' | undefined) */
exports.makeTable = (content, name="new-table", index=undefined, keyed=false) => {

    let table = {
        name: name,
        content: undefined,
        index: undefined,
        keys: undefined
    }

    switch (index) {
        case WEIGHT: table.index = WEIGHT; break;
        case RANGE: table.index = RANGE; break;
    }

    // split lines, trim whitespace, remove empty lines
    content = content.split('\n')
        .map(line => line.trim())
        .filter(line => line)
        .map(line => { 
            let x = { key: undefined, index: 1, description: line };
            return x;
        })

    if (keyed && !(table.index)) {
        keyRegex
    } else if (!keyed && table.index) {
        if (table.index == WEIGHT) {
            weightRegex
        } else if (table.index == WEIGHT) {
            rangeRegex
        }
    } else if (keyed & table.index) {
        if (table.index == WEIGHT) {
            weightAndKeyRegex
        } else if (table.index == WEIGHT) {
            rangeAndKeyRangeRegex
        }
    } else {
        // all weights are 1, no keys
        table.index = WEIGHT
        table.content = content
    }

    // log to console the existence of any lines that don't successfully regex, but keep going

    if (exports.tables[name]) {
        console.log(`Table '${name}' already exists.  Overwriting...`)
    }
    exports.tables[name] = table

    return table
}

/** Random choice from table; optionally using supplied roll */
exports.pick = (table, roll=undefined) => {
    const randomIndex = Math.floor(m.random() * table.content.length)

    return table.content[randomIndex]
}

exports.alphabetizeKeys = (obj) => {
    var sortedObject = {};
    const sortedKeys = Object.keys(obj).sort();
    sortedKeys.forEach(key => {
        sortedObject[key] = ((typeof obj[key]) == 'object') ? alphabetizeKeys(obj[key]) : obj[key];
    });

    return sortedObject;
}