// History PCG

import { m, Table, d, RANGE, pick } from "../scripts/utils.js"

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
1:2     Combo           (Combo) -> {{ nonStrangeAge().key }} / {{ nonStrangeAge().key }}
# TODO Both Combo ages could be from the prior age's Leads-to list, or one could be and the other is completely random. Interpret freely.
3:4     Wonders         (Age of Wonders) -> {{ nonStrangeAge().key }}
5:6     Lost            (Lost Age) Secretly -> {{ nonStrangeAge().key }}
7:8     Discontinuity   (Discontinuity) {{ nonStrangeAge().key }}
`
})

function nonStangeAge() { return historicalAges.pick(d(18)) }

let historicalAgeLeadsTo = new Table({
    name: "historical-age-leads-to",
    keyed: true,
    content: `
Wild            {{ history.ages.pick( pick(Rising, Strife, Discovery, Dark, Placid) ) }}
Falling         {{ history.ages.pick( pick(Wild, Rising, Tyranny, Strife, Discovery, Dark, Placid) ) }}
Rising          {{ history.ages.pick( pick(Falling, Tyranny, Strife, Discovery, Golden, Decay) ) }}
Tyranny         {{ history.ages.pick( pick(Falling, Rising, Strife, Discovery, Dark, Golden, Decay) ) }}
Strife          {{ history.ages.pick( pick(Wild, Falling, Rising, Tyranny, Dark, Placid, Golden, Decay) ) }}
Discovery       {{ history.ages.pick( pick(Falling, Rising, Tyranny, Strife, Golden, Decay) ) }}
Dark            {{ history.ages.pick( pick(Wild, Rising, Tyranny, Strife, Discovery, Placid) ) }}
Decay           {{ history.ages.pick( pick(Wild, Falling, Rising, Tyranny, Strife, Discovery, Dark, Placid) ) }}
Placid          {{ history.ages.pick( pick(Wild, Rising, Strife, Discovery) ) }}
Golden          {{ history.ages.pick( pick(Falling, Tyranny, Strife, Discovery, Decay) ) }}
Strange         [[historical-ages]]
`
})

let historicalAgeArisesFrom = new Table({
    name: "historical-age-arises-from",
    keyed: true,
    content: `
Wild            {{ history.ages.pick( pick(Ffalling, Strife, Dark, Placid) ) }}
Falling         {{ history.ages.pick( pick() ) }}
Arises from: rising (1), tyranny (2), strife (3), discovery (4), golden (5)

Rising          {{ history.ages.pick( pick() ) }}
Arises from: wild (1), falling (2), tyranny (3), strife (4), discovery (5), dark (6), placid (7)

Tyranny         {{ history.ages.pick( pick() ) }}
Arises from: rising (1), falling (2), strife (3), discovery (4), dark (5), golden (6)

Strife          {{ history.ages.pick( pick() ) }}
Arises from: wild (1), rising (2), falling (3), tyranny (4), discovery (5), dark (6), placid (7), golden (8)

Discovery       {{ history.ages.pick( pick() ) }}
Arises from: wild (1), rising (2), falling (3), tyranny (4), dark (5), placid (6), golden (7)

Dark            {{ history.ages.pick( pick() ) }}
Arises from: wild (1), falling (2), tyranny (3), strife (4)

Decay           {{ history.ages.pick( pick() ) }}
Arises from: rising (1), tyranny (2), strife (3), discovery (4), golden (5)

Placid          {{ history.ages.pick( pick() ) }}
Arises from: wild (1), falling (2), strife (3), dark (4)

Golden          {{ history.ages.pick( pick() ) }}
Arises from: rising (1), tyranny (2), strife (3), discovery (4)

Strange         [[historical-ages]]
`
})
