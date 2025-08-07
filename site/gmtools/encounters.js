// Nomicon: Hellenica Names

import { m, Table, d, RANGE } from "../scripts/utils.js"

export const encounters = { }
export default encounters

const debug = false

encounters.activity = (roll=undefined) => {
    return activity.pick(roll)
}

let activity = new Table({
    name: "encounters-activity",
    defaultRoll: () => d(6) + d(6),
    index: RANGE,
    keyed: true,
    content: `
2   Hurting         beat up from a fight or happenstance (wary, probably returning to lair; reduce hp)
3   Fighting        fighting with another creature (roll up another monster)
4   Logistics       dealing with treasure, prisoners, and/or food or supplies (likely returning to lair with prizes; might roll treasure as if in lair)
5   Intra-group     intra-group interaction (eating, argument, duel, mating display, dominance contest, council, trial, game, ritual)
6   Traveling       traveling (on the way to somewhere else, not looking for a fight)
7   Patrolling      patrolling (warparty looking for invaders, defending territory or exploring new area, may be lurking in blinds, may have set traps)
8   Prowling        raiding, hunting for food or other territorial maintenance (quiet, wary, and hard to surprise, may be lurking in blinds, may have set traps)
9   Inter-group     inter-group interactions, meeting with another group (diplomacy, trade, debate, ransom, threats / posturing, ceremony, moot, roll up another group)
10  Chase           chasing or running away from another creature (roll up another monster)
11  Working         building (digging a burrow, making or breaking camp, establishing a new lair, laying traps, felling trees, raising buildings, repairing wagons)
12  Groggy          groggy (sleeping off a meal, drunk, sick, stuck or disabled; easy to surprise/bypass)
`
})

encounters.partyActivity = (roll=undefined) => {
    return partyActivity.pick(roll)
}

let partyActivity = new Table({
    name: "encounters-party-activity",
    // defaultRoll: () => d(6) + d(6),
    // index: RANGE,
    // keyed: true,
    content: `
Traveling in good order
Straggling / split up / someone scouting ahead / behind
Rest break
Paused to map / navigate / choose a path
Paused to forage or examine a possible hazard / discovery / feature / vista
Chatting / singing / sharing camraderie / having an argument
Adjusting inventory / packs or tending animals / wagons
In the midst of handling a hazard / obstacle / dificulty (working down-slope, balancing on a log, roped together)
`
})

// Considerations on Encounters / Omens / Spoor
// * Terrain Specifics
// 	* Road condition (normal, degraded, bad shape), exactly what this means depends on the terrain around it.
// 	* Local environment (Knave, Shadowdark have charts)
// * What is the party doing?
// 	* Traveling in good order
// 	* Straggling / split up / someone scouting ahead / behind
// 	* Rest break
// 	* Paused to map / navigate / choose a path
// 	* Paused to forage or examine a possible hazard / discovery / feature / vista
// 	* Chatting / singing / sharing camraderie / having an argument
// 	* Adjusting inventory / packs or tending animals / wagons
// * What are the monsters doing?
// 	* In Lair?
// 	* Activity
// 	* Reaction
// * Monster's approach
// 	* Either group surprised?
// 	* Direction and distance
