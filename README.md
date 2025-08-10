# gametools

## GitHub Pages

https://kalyptein.github.io/gametools/

## Tables

`Constructing tables`

```javascript
let table1 = new Table({
    name: "a-super-simple-table",
    content: `
this is the first entry
this is the second entry &&
which has a second line that will get appended onto the previous one
this is the third entry
`
})

let table2 = new Table({
    name: "simple-table-with-keys",
    keyed: true,
    content: `
Key1        this is the first entry
KeyTwo      this is the second entry
ThirdKey    this is the third entry
`
})

let table3 = new Table({
    name: "table-with-weights",
    index: WEIGHT,
    content: `
2  this is the first entry w/ weight = 2
1  this is the second entry w/ weight = 1
3  this is the third entry w/ weight = 3
`
})

let table4 = new Table({
    name: "table-with-ranges",
    defaultRoll: () => d(6) + d(6),                 // optional
    index: RANGE,
    content: `
2:5   this is the first entry, happens on a roll of 2-5
6     this is the second entry, happens on a roll of 6
7:12  this is the third entry, happens on a roll of 7-12
`
})

let table5 = new Table({
    name: "table-with-inlines",
    content: `
this is the {{pick('first','best','worst')}} entry
this is the {{1+1}}nd entry and rolls a d6+2 and gets a {{d(6)+2}}
this is the third entry and rolls on a subtable and gets [[table-with-weights]]
this is the 4th entry, rolls subtable with argument [[table-with-weights#5]] or roll [[table-with-weights#d(5)]]
`
})
```

`Using a table`

```javascript
let table = tables['table-with-ranges']        // retreive a table
let result = table.pick()                      // roll w/ default function
let result = table.pick(() => d(2)+1)          // roll w/ supplied function
let result = table.pick(7)                     // get result of a roll of 7

let result = table2.pick('KeyTwo')              // get result with key 'KeyTwo'
```

`Notes`
- Tables can be retrieved by name from the `tables` object.
- If a `defaultRoll` function isn't supplied, a roll between `[minRange, maxRange]` will be created.  Weights are used to construct ranges.
    - There are currently no checks to prevent range gaps or overlaps.
- The `keyed` parameter can be added to any kind of index and parses as `[weight|range] [key] [description]`
    - Keys can be used as one word summaries / names for the entry and can be used to retrieve the entry.  Keys can include any non-whitespace characters.
    - A console message will log duplicate keys, which will overwrite the prior entry.
- Whitespace between the index and/or key and/or description is ignored.  Whitespace at the beginning and ends of lines are trimmed.
    - Blank lines can be inserted between entries and will be ignored.
    - Comment lines beginning with # (apart from whitespace) will be ignored.
- Returned entries are objects of the form `{ key: 'keytext or empty', index: [min,max], description: 'description text' }`

