// History PCG

import { m, Table, d, RANGE, pick, tables } from "../scripts/utils.js"

export const history = { }
export default history

const debug = false

history.ages = (roll=undefined) => {
    return historicalAges.pick(roll)
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
1:2     Combo           (Combo) => [[historical-ages#d(18)]].key / [[historical-ages#d(18)]].key
# TODO Both Combo ages could be from the prior age's Leads-to list, or one could be and the other is completely random. Interpret freely.
3:4     Wonders         (Age of Wonders) => [[historical-ages#d(18)]].key
5:6     Lost            (Lost Age) => [[historical-ages#d(18)]].key
7:8     Discontinuity   (Discontinuity) => [[historical-ages#d(18)]].key
`
})

history.leadsTo = {
    name:       "historical-age-leads-to", 
    Wild:       () => historicalAges.pick(pick('Rising',  'Strife',  'Discovery', 'Dark',      'Placid')),
    Falling:    () => historicalAges.pick(pick('Wild',    'Rising',  'Tyranny',   'Strife',    'Discovery', 'Dark',      'Placid')),
    Rising:     () => historicalAges.pick(pick('Falling', 'Tyranny', 'Strife',    'Discovery', 'Golden',    'Decay')),
    Tyranny:    () => historicalAges.pick(pick('Falling', 'Rising',  'Strife',    'Discovery', 'Dark',      'Golden',    'Decay')),
    Strife:     () => historicalAges.pick(pick('Wild',    'Falling', 'Rising',    'Tyranny',   'Dark',      'Placid',    'Golden', 'Decay')),
    Discovery:  () => historicalAges.pick(pick('Falling', 'Rising',  'Tyranny',   'Strife',    'Golden',    'Decay')),
    Dark:       () => historicalAges.pick(pick('Wild',    'Rising',  'Tyranny',   'Strife',    'Discovery', 'Placid')),
    Decay:      () => historicalAges.pick(pick('Wild',    'Falling', 'Rising',    'Tyranny',   'Strife',    'Discovery', 'Dark',   'Placid')),
    Placid:     () => historicalAges.pick(pick('Wild',    'Rising',  'Strife',    'Discovery')),
    Golden:     () => historicalAges.pick(pick('Falling', 'Tyranny', 'Strife',    'Discovery', 'Decay')),
    Strange:    () => historicalAges.pick()
}


history.arisesFrom = {
    name:       "historical-age-arises-from",
    Wild:       () => historicalAges.pick(pick('Falling', 'Strife',  'Dark',    'Placid')),
    Falling:    () => historicalAges.pick(pick('Rising',  'Tyranny', 'Strife',  'Discovery', 'Golden')),
    Rising:     () => historicalAges.pick(pick('Wild',    'Falling', 'Tyranny', 'Strife',    'Discovery', 'Dark',   'Placid')),
    Tyranny:    () => historicalAges.pick(pick('Rising',  'Falling', 'Strife',  'Discovery', 'Dark',      'Golden')),
    Strife:     () => historicalAges.pick(pick('Wild',    'Rising',  'Falling', 'Tyranny',   'Discovery', 'Dark',   'Placid', 'Golden')),
    Discovery:  () => historicalAges.pick(pick('Wild',    'Rising',  'Falling', 'Tyranny',   'Dark',      'Placid', 'Golden')),
    Dark:       () => historicalAges.pick(pick('Wild',    'Falling', 'Tyranny', 'Strife')),
    Decay:      () => historicalAges.pick(pick('Rising',  'Tyranny', 'Strife',  'Discovery', 'Golden')),
    Placid:     () => historicalAges.pick(pick('Wild',    'Falling', 'Strife',  'Dark')),
    Golden:     () => historicalAges.pick(pick('Rising',  'Tyranny', 'Strife',  'Discovery')),
    Strange:    () => historicalAges.pick()
}
