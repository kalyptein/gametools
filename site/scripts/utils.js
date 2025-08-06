
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

// regex pieces
const gap = `\\s*`
const key = `(\\S+)`
const wt = `([0-9]+)`
const range = '(-?[0-9]+)' + gap + ':' + gap + '(-?[0-9]+)'

const regex = {
    key:    new RegExp(`^${key+gap}(.+)$`),
    weight: new RegExp(`^${wt+gap}(.+)$`),
    range:  new RegExp(`^${range+gap}(.+)$`),
    weightAndKey: new RegExp(`^${wt+gap+key+gap}(.+)$`),
    rangeAndKey:  new RegExp(`^${range+gap+key+gap}(.+)$`),
}

// const keyRegex =              new RegExp(`^([A-Za-z0-9_\\-]+)\\s+(.+)$`)                                    // textKey rest of line is description                   key the rest is description
// const weightRegex =           new RegExp(`^([0-9]+)\\s+(.+)$`)                                              // weightNumber rest of line is description              3 the rest is description
// const weightAndKeyRegex =     new RegExp(`^([0-9]+)\\s+([A-Za-z0-9_\\-]+)\\s+(.+)$`)                        // weightNumber textKey rest of line is description      3 key the rest is description
// const rangeRegex =            new RegExp(`^(-?[0-9]+)\\s*:\\s*(-?[0-9]+)\\s+(.+)$`)                         // x:y rest of line is description                       2:7 the rest is description
// const rangeAndKeyRangeRegex = new RegExp(`^(-?[0-9]+)\\s*:\\s*(-?[0-9]+)\\s+([A-Za-z0-9_\\-]+)\\s+(.+)$`)   // x-y textKey rest of line is description               2:7 key the rest is description

/** Parse content to create a table (index = 'weight' | 'range' | undefined) */
exports.makeTable = (content, name="new-table", index=undefined, keyed=false) => {

    let table = {
        name: name,
        content: undefined,
        index: undefined,
        keys: {}
    }

    let re = undefined
    switch (index) {
        case WEIGHT:
            table.index = WEIGHT;
            re = (keyed) ? regex.weightAndKey : regex.weight
            break;
        case RANGE: 
            table.index = RANGE;
            re = (keyed) ? regex.rangeAndKey : regex.range
            break;
        default:
            table.index = WEIGHT;
            re = (keyed) ? regex.key : undefined
            break;
    }

    // split lines, trim whitespace, remove empty lines, parse w/ regex
    let totalWeight = 0;
    table.content = content.split('\n')
        .map(line => {
            line = line.trim()
            if (!line) { return undefined }

            let parsed = (re) ? line.match(re) : [ '', line ]
            if (parsed.length < 2) {
                console.warn(`Line didn't parse w/ regex: ${line}`)
                return undefined;
            } else {
                parsed = { key: '', index: 1, description: '' }
                parsed.description = parsed[parsed.length-1]
                switch (index) {
                    case WEIGHT: 
                        parsed.index = number(parsed[1])
                        totalWeight += parsed.index
                        parsed.key = (keyed) ? parsed[2] : ''
                        break
                    case RANGE: 
                        parsed.index = [ number(parsed[1]), number(parsed[2]) ]
                        parsed.key = (keyed) ? parsed[3] : ''
                        break
                    default: 
                        parsed.index = 1
                        totalWeight += parsed.index
                        parsed.key = (keyed) ? parsed[1] : ''
                        break
                }
                if (parsed.key) {
                    if (table.keys[parsed.key]) { console.warn(`Duplicate key ${parsed.key} in ${table.name}`) }
                    table.keys[parsed.key] = parsed
                }
            }
            return parsed
        })
        .filter(line => line)

    switch (table.index) {
        case WEIGHT: 
            table.totalWeight = totalWeight
            // TODO turn weights into ranges?
            break
        case RANGE:
            // TODO check for overlapping ranges
            break
    }

    if (exports.tables[name]) {
        console.warn(`Duplicate table '${name}', overwriting...`)
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