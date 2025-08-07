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
