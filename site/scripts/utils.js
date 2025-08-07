import { MersenneTwister } from "./seedableRandom.js"

// start RNG
export var m = new MersenneTwister()
console.log("seed = " + m.seed)


export function d(size) {
    return Math.floor(m.random() * size) + 1
}

// This is external JavaScript code
// document.getElementById("resultDisplay").textContent = "Content added by external JavaScript!"

export const tables = {};

export const WEIGHT = 'weight'
export const RANGE = 'range'

// TODO
// tables should be able to roll on subtables; replace [[table_name]] within the text of a description with a roll on the subtable
//      recursive, until all [[entries]] are gone or failed to find the named table


// regex pieces
const gap = `\\s*`
const key = `(\\S+)`
const weight = `([0-9]+)`
const range = '(-?[0-9]+)' + gap + ':?' + gap + '(-?[0-9]*)'

const regex = {
    key:    new RegExp(`^${key+gap}(.+)$`),                         // textKey rest of line is description                   key the rest is description
    weight: new RegExp(`^${weight+gap}(.+)$`),                      // weightNumber rest of line is description              3 the rest is description
    range:  new RegExp(`^${range+gap}(.+)$`),                       // x:y rest of line is description                       2:7 the rest is description
    weightAndKey: new RegExp(`^${weight+gap+key+gap}(.+)$`),        // weightNumber textKey rest of line is description      3 key the rest is description
    rangeAndKey:  new RegExp(`^${range+gap+key+gap}(.+)$`),         // x-y textKey rest of line is description               2:7 key the rest is description
}

export class Table {
    
    constructor({ content, name="new-table", index=undefined, keyed=false, defaultRoll=undefined }) {

        this.name = name
        this.keys = {}
        this.content = undefined
        this.defaultRoll = defaultRoll
        this.indexRange = undefined

        // choose regex
        let re = undefined
        switch (index) {
            case WEIGHT: re = (keyed) ? regex.weightAndKey : regex.weight; break;
            case RANGE: re = (keyed) ? regex.rangeAndKey : regex.range; break;
            default: re = (keyed) ? regex.key : undefined; break;
        }

        // split lines, trim whitespace, remove empty lines, combine multiline entries
        content = content.split('\n').map(line => line.trim())
        let mergeMultilines = []
        let merge = ''
        for (var i=0; i < content.length; i++) {
            if (content[i].endsWith('&&')) {
                merge += content[i].slice(0, -2).trim()
            } else {
                if (merge) {
                    mergeMultilines.push(merge + content[i])
                    merge = ''
                } else {
                    mergeMultilines.push(content[i])
                }
            }
        }
        if (merge) { mergeMultilines.push(merge) }  // apply last lines, in case it ends w/ &&
        content = (mergeMultilines.length > 0) ? mergeMultilines : content

        // parse lines w/ regex
        let currentIndex = 1
        this.content = content.map(line => {
            if (!line) { return undefined }

            let parsed = (re) ? line.match(re) : [ '', line ]
            let entry = { key: '', index: 1, description: '' }
            if (!parsed) {
                console.warn(`Line didn't parse w/ regex: ${line}`)
                return undefined;
            } else {
                entry.description = parsed[parsed.length-1]
                switch (index) {
                    case RANGE: 
                        if (!parsed[2]) { parsed[2] = parsed[1] }
                        entry.index = [ Number(parsed[1]), Number(parsed[2]) ]
                        if (entry.index[0] > entry.index[1]) entry.index = [ entry.index[1], entry.index[0] ]       // given x:y, make sure x <= y
                        entry.key = (keyed) ? parsed[3] : ''
                        break
                    case WEIGHT: 
                        entry.index = [ currentIndex, currentIndex + Number(parsed[1]) - 1 ]
                        currentIndex = entry.index[1] + 1
                        entry.key = (keyed) ? parsed[2] : ''
                        break
                    default:
                        entry.index = [ currentIndex, currentIndex ]
                        currentIndex = entry.index[1] + 1
                        entry.key = (keyed) ? parsed[1] : ''
                        break
                }

                if (isNaN(entry.index[0]) || isNaN(entry.index[1])) {
                    if (this.keys[entry.key]) { console.warn(`NaN index in ${name}: ${line}`) }
                    return undefined
                }

                if (!this.indexRange) this.indexRange = [ entry.index[0], entry.index[1] ]
                this.indexRange[0] = Math.min(this.indexRange[0], entry.index[0])
                this.indexRange[1] = Math.max(this.indexRange[1], entry.index[1])

                if (entry.key) {
                    if (this.keys[entry.key]) { console.warn(`Duplicate key ${entry.key} in ${name}: ${line}`) }
                    this.keys[entry.key] = entry
                }
            }
            return entry
        })
        .filter(line => line)

        if (!this.defaultRoll) {
            this.defaultRoll = () => Math.floor(m.random() * (this.indexRange[1] - this.indexRange[0] + 1)) + this.indexRange[0]
        }

        // TODO check for overlapping ranges? range gaps?

        // add to map of tables
        if (tables[name]) {
            console.warn(`Duplicate table '${name}', overwriting...`)
        }
        tables[name] = this
    }

    /** Random choice from table; optionally using supplied roll */
    pick(roll=undefined) {

        // process roll w/ default or supplied function
        switch (typeof roll) {
            case "undefined": roll = this.defaultRoll(); break
            case "function": roll = roll(); break
        }

        let entry = undefined
        switch (typeof roll) {
            // supplied or function-generated key string
            case "string":  entry = this.keys[roll]; break
            // supplied or rolled number
            case "number": entry = this.content.find(entry => entry.index[0] <= roll && entry.index[1] >= roll); break
        }

        return (entry) ? entry : { key: 'nullEntry', index: NaN, description: `index ${roll} not found on table ${this.name}` }
        
    }

    draw() {
        // TODO pick w/o replacement, like a card draw
    }

    shuffle(cards=[]) {
        // TODO put drawn "cards" back in table; if specific cards supplied as param, only shuffle those in
    }
}

export function alphabetizeKeys(obj) {
    var sortedObject = {};
    const sortedKeys = Object.keys(obj).sort();
    sortedKeys.forEach(key => {
        sortedObject[key] = ((typeof obj[key]) == 'object') ? alphabetizeKeys(obj[key]) : obj[key]
    });

    return sortedObject;
}

export default {
    tables: tables,
    Table: Table,
    alphabetizeKeys: alphabetizeKeys,
    WEIGHT: WEIGHT,
    RANGE: RANGE
}
