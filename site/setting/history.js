// History PCG

import { m, Table, d, RANGE, pick, tables } from "../scripts/utils.js"

export const history = { }
export default history

const debug = false

history.ages = (roll=undefined) => {
    return historicalAges.pick(roll)
}

history.leadsTo = (roll=undefined) => {
    return historicalAgeLeadsTo.pick(roll)
}

history.arisesFrom = (roll=undefined) => {
    return historicalAgeArisesFrom.pick(roll)
}

let historicalAges = new Table({
    name: "historical-ages",
    // defaultRoll: () => d(20),
    index: RANGE,
    keyed: true,
    content: `
1:2         Wild            Civilization is frail, the wild is strong
3:4         Falling         Fragmentation, division, loss of connection, loss of unity
5:6         Rising          Unification, codification, connecting, developing
7:8         Tyranny         Authoritarianism, dictatorship, oppression
9:10        Strife          Hardship, conflict, intrigue, upheaval, disaster
11:12       Discovery       New lands, new developments, new culture, new thought
13:14       Dark            Ruins, ignorance, rule by strongmen, poverty
15:16       Decay           Decadence, lethargy, ossification, paralysis
17          Placid          Simple times, peaceful
18          Golden          Glory, prosperity, grandeur
19:20       Strange         [[historical-age-strange]]
`
})

let historicalAgeStrange = new Table({
    name: "historical-age-strange",
    index: RANGE,
    keyed: true,
    content: `
1:2     Combo           (Combo) => {{ tables['historical-ages'].pick(d(18)).key }} / {{ tables['historical-ages'].pick(d(18)).key }}
# TODO Both Combo ages could be from the prior age's Leads-to list, or one could be and the other is completely random. Interpret freely.
3:4     Wonders         (Age of Wonders) => {{ tables['historical-ages'].pick(d(18)).key }}
5:6     Lost            (Lost Age) => {{ tables['historical-ages'].pick(d(18)).key }}
7:8     Discontinuity   (Discontinuity) {{ tables['historical-ages'].pick(d(18)).key }}
`
})

let historicalAgeLeadsTo = new Table({
    name: "historical-age-leads-to",
    keyed: true,
    content: `
Wild            {{ history.ages.pick( pick('Rising',  'Strife',  'Discovery', 'Dark',      'Placid') ) }}
Falling         {{ history.ages.pick( pick('Wild',    'Rising',  'Tyranny',   'Strife',    'Discovery', 'Dark',      'Placid') ) }}
Rising          {{ history.ages.pick( pick('Falling', 'Tyranny', 'Strife',    'Discovery', 'Golden',    'Decay') ) }}
Tyranny         {{ history.ages.pick( pick('Falling', 'Rising',  'Strife',    'Discovery', 'Dark',      'Golden',    'Decay') ) }}
Strife          {{ history.ages.pick( pick('Wild',    'Falling', 'Rising',    'Tyranny',   'Dark',      'Placid',    'Golden', 'Decay') ) }}
Discovery       {{ history.ages.pick( pick('Falling', 'Rising',  'Tyranny',   'Strife',    'Golden',    'Decay') ) }}
Dark            {{ history.ages.pick( pick('Wild',    'Rising',  'Tyranny',   'Strife',    'Discovery', 'Placid') ) }}
Decay           {{ history.ages.pick( pick('Wild',    'Falling', 'Rising',    'Tyranny',   'Strife',    'Discovery', 'Dark',   'Placid') ) }}
Placid          {{ history.ages.pick( pick('Wild',    'Rising',  'Strife',    'Discovery') ) }}
Golden          {{ history.ages.pick( pick('Falling', 'Tyranny', 'Strife',    'Discovery', 'Decay') ) }}
Strange         [[historical-ages]]
`
})

let historicalAgeArisesFrom = new Table({
    name: "historical-age-arises-from",
    keyed: true,
    content: `
Wild            {{ history.ages.pick( pick('Falling', 'Strife',  'Dark',    'Placid') ) }}
Falling         {{ history.ages.pick( pick('Rising',  'Tyranny', 'Strife',  'Discovery', 'Golden') ) }}
Rising          {{ history.ages.pick( pick('Wild',    'Falling', 'Tyranny', 'Strife',    'Discovery', 'Dark',   'Placid') ) }}
Tyranny         {{ history.ages.pick( pick('Rising',  'Falling', 'Strife',  'Discovery', 'Dark',      'Golden') ) }}
Strife          {{ history.ages.pick( pick('Wild',    'Rising',  'Falling', 'Tyranny',   'Discovery', 'Dark',   'Placid', 'Golden') ) }}
Discovery       {{ history.ages.pick( pick('Wild',    'Rising',  'Falling', 'Tyranny',   'Dark',      'Placid', 'Golden') ) }}
Dark            {{ history.ages.pick( pick('Wild',    'Falling', 'Tyranny', 'Strife') ) }}
Decay           {{ history.ages.pick( pick('Rising',  'Tyranny', 'Strife',  'Discovery', 'Golden') ) }}
Placid          {{ history.ages.pick( pick('Wild',    'Falling', 'Strife',  'Dark') ) }}
Golden          {{ history.ages.pick( pick('Rising',  'Tyranny', 'Strife',  'Discovery') ) }}
Strange         [[historical-ages]]
`
})
