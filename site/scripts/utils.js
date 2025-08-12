import { MersenneTwister } from "./seedableRandom.js"

// start RNG
export var m = new MersenneTwister()
console.log("seed = " + m.seed)


export function d(size) {
    return Math.floor(m.random() * size) + 1
}

export function XdY(number, size) {
    let sum = 0;
    for (var i=0; i < number; i++) { sum += d(size) }
    return sum
}

export function pick(...list) {
    return list[Math.floor(m.random() * list.length)]
}

// This is external JavaScript code
// document.getElementById("resultDisplay").textContent = "Content added by external JavaScript!"

export const tables = {};

export const WEIGHT = 'weight'
export const RANGE = 'range'

// TODO
//
// find something better/safer than eval() for inline math

// regex pieces
const gap = `\\s*`
const key = `(\\S+)`
const weight = `([0-9]+)`
const range = '(-?[0-9]+)' + gap + ':?' + gap + '(-?[0-9]*)'

const regex = {
    key:    new RegExp(`^${key+gap}(.+)$`),                                          // textKey rest of line is description                   key the rest is description
    weight: new RegExp(`^${weight+gap}(.+)$`),                                       // weightNumber rest of line is description              3 the rest is description
    range:  new RegExp(`^${range+gap}(.+)$`),                                        // x:y rest of line is description                       2:7 the rest is description
    weightAndKey: new RegExp(`^${weight+gap+key+gap}(.+)$`),                         // weightNumber textKey rest of line is description      3 key the rest is description
    rangeAndKey:  new RegExp(`^${range+gap+key+gap}(.+)$`),                          // x-y textKey rest of line is description               2:7 key the rest is description
    subtable: new RegExp(`(\\[\\[([^\\[\\]{}]+?)(#([^\\[\\]{}]*?))?\\]\\](.key)?)`), // do #roll on [[subtable-name]] here                    #roll is optional
    math:     new RegExp(`({{([^{}\\[\\]]+?)}})`),                                   // resolve some inline math {{d(10)+4}} here
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

        // split lines, trim whitespace, combine multiline entries
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
            if (!line || line.startsWith('#')) { return undefined }     // skip blank lines and comments (starting w/ #)

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

        let originalEntry = undefined
        switch (typeof roll) {
            // supplied or function-generated key string
            case "string":  originalEntry = this.keys[roll]; break
            // supplied or rolled number
            case "number": originalEntry = this.content.find(e => e.index[0] <= roll && e.index[1] >= roll); break
        }

        let entry = undefined
        if (originalEntry) {
            entry = Object.assign({}, originalEntry)
            entry.roll = roll
            let matches = ''
            let end = false

            while (!end) {
                end = true

                // recursive rolls on subtables
                matches = entry.description.match(regex.subtable)
                if (matches) {
                    end = false
                    try {
                        let subtableName = matches[2]
                        let stRoll = (matches[4]) ? matches[4] : undefined
                        if (stRoll && !isNaN(Number(stRoll))) { stRoll = Number(stRoll) }       // convert number string to number
                        stRoll = eval(stRoll)
                        let subtableValue = tables[subtableName]?.pick(stRoll)
                        subtableValue = (subtableValue) ?
                            (matches[5] == ".key") ? subtableValue.key : subtableValue.description :
                            `UNKNOWN ${subtableName}`
                        entry.description = entry.description.replace(regex.subtable, subtableValue)
                    } catch (e) { break }
                }
                
                // resolve inline math / commands (dice rolls, etc)
                matches = entry.description.match(regex.math)
                if (matches) {
                    end = false
                    try {
                        let inline = eval(matches[2].trim())
                        // let inline = simplify(matches[2])
                        entry.description = entry.description.replace(regex.math, (inline) ? inline : 'FAILED_EVAL')
                    } catch (e) { 
                        entry.description = entry.description.replace(regex.math, 'FAILED_EVAL')
                        break
                    }
                }
            }
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

export function addElement(parent, type, text=undefined, ...attributes) {
    return insertElement(parent, undefined, type, false, text, ...attributes)
}

export function insertElement(parent, refNode, type, before=false, text=undefined, ...attributes) {
    if (!parent) {
        console.error("No parent element given.")
        return undefined
    }

    let el = document.createElement(type)
    if (text) { el.textContent = text }

    // TODO apply attributes
    // if (attributes.length > 0) {
    //     el.setAttribute()
    // }
    
    const childrenArray = Array.from(parent.children); // Convert HTMLCollection to Array
    const index = childrenArray.indexOf(refNode);
    if (before && refNode) {
        parent.insertBefore(el, refNode)
    } else if (!refNode || (parent.childElementCount-1 == index && !before)) {
        parent.appendChild(el)
    } else {
        refNode = childrenArray[index+1]
        parent.insertBefore(el, refNode)
    }
    return el
}

export function getRadioSelected(group) {
    let els = document.getElementsByName(group);
    for (let i = 0; i < els.length; i++) {
        if (els[i].checked) { return els[i] }
    }
    return undefined
}

export default {
    tables: tables,
    Table: Table,
    alphabetizeKeys: alphabetizeKeys,
    addElement: addElement,
    insertElement: insertElement, 
    getRadioSelected: getRadioSelected,
    WEIGHT: WEIGHT,
    RANGE: RANGE
}