// History PCG

import { m, Table, d, RANGE, pick, tables } from "../scripts/utils.js"

export const history = { }
export default history

const debug = false

export const ageList = ['Wild', 'Falling', 'Rising', 'Tyranny', 'Strife', 'Discovery', 'Dark', 'Decay', 'Placid', 'Golden', 'Strange']
export const strangeList = ['Combo', 'Age of Wonders', 'Lost Age', 'Discontinuity']

history.ages = (roll=undefined) => {
    if (!roll && history.noStrange) { roll = d(18) }
    return historicalAges.pick(roll)
}

history.noStrange = false

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
1:2     Combo           Combo
3:4     Wonders         Age of Wonders
5:6     Lost            Lost Age
7:8     Discontinuity   Discontinuity
`
})

history.leadsTo = {
    name:       "historical-age-leads-to", 
    Wild:       () => historicalAges.pick((d(10)==10 && !history.noStrange) ? 'Strange' : pick('Rising',  'Strife',  'Discovery', 'Dark',      'Placid')),
    Falling:    () => historicalAges.pick((d(10)==10 && !history.noStrange) ? 'Strange' : pick('Wild',    'Rising',  'Tyranny',   'Strife',    'Discovery', 'Dark',      'Placid')),
    Rising:     () => historicalAges.pick((d(10)==10 && !history.noStrange) ? 'Strange' : pick('Falling', 'Tyranny', 'Strife',    'Discovery', 'Golden',    'Decay')),
    Tyranny:    () => historicalAges.pick((d(10)==10 && !history.noStrange) ? 'Strange' : pick('Falling', 'Rising',  'Strife',    'Discovery', 'Dark',      'Golden',    'Decay')),
    Strife:     () => historicalAges.pick((d(10)==10 && !history.noStrange) ? 'Strange' : pick('Wild',    'Falling', 'Rising',    'Tyranny',   'Dark',      'Placid',    'Golden', 'Decay')),
    Discovery:  () => historicalAges.pick((d(10)==10 && !history.noStrange) ? 'Strange' : pick('Falling', 'Rising',  'Tyranny',   'Strife',    'Golden',    'Decay')),
    Dark:       () => historicalAges.pick((d(10)==10 && !history.noStrange) ? 'Strange' : pick('Wild',    'Rising',  'Tyranny',   'Strife',    'Discovery', 'Placid')),
    Decay:      () => historicalAges.pick((d(10)==10 && !history.noStrange) ? 'Strange' : pick('Wild',    'Falling', 'Rising',    'Tyranny',   'Strife',    'Discovery', 'Dark',   'Placid')),
    Placid:     () => historicalAges.pick((d(10)==10 && !history.noStrange) ? 'Strange' : pick('Wild',    'Rising',  'Strife',    'Discovery')),
    Golden:     () => historicalAges.pick((d(10)==10 && !history.noStrange) ? 'Strange' : pick('Falling', 'Tyranny', 'Strife',    'Discovery', 'Decay')),
    Strange:    () => historicalAges.pick()
}


history.arisesFrom = {
    name:       "historical-age-arises-from",
    Wild:       () => historicalAges.pick((d(10)==10 && !history.noStrange) ? 'Strange' : pick('Falling', 'Strife',  'Dark',    'Placid')),
    Falling:    () => historicalAges.pick((d(10)==10 && !history.noStrange) ? 'Strange' : pick('Rising',  'Tyranny', 'Strife',  'Discovery', 'Golden')),
    Rising:     () => historicalAges.pick((d(10)==10 && !history.noStrange) ? 'Strange' : pick('Wild',    'Falling', 'Tyranny', 'Strife',    'Discovery', 'Dark',   'Placid')),
    Tyranny:    () => historicalAges.pick((d(10)==10 && !history.noStrange) ? 'Strange' : pick('Rising',  'Falling', 'Strife',  'Discovery', 'Dark',      'Golden')),
    Strife:     () => historicalAges.pick((d(10)==10 && !history.noStrange) ? 'Strange' : pick('Wild',    'Rising',  'Falling', 'Tyranny',   'Discovery', 'Dark',   'Placid', 'Golden')),
    Discovery:  () => historicalAges.pick((d(10)==10 && !history.noStrange) ? 'Strange' : pick('Wild',    'Rising',  'Falling', 'Tyranny',   'Dark',      'Placid', 'Golden')),
    Dark:       () => historicalAges.pick((d(10)==10 && !history.noStrange) ? 'Strange' : pick('Wild',    'Falling', 'Tyranny', 'Strife')),
    Decay:      () => historicalAges.pick((d(10)==10 && !history.noStrange) ? 'Strange' : pick('Rising',  'Tyranny', 'Strife',  'Discovery', 'Golden')),
    Placid:     () => historicalAges.pick((d(10)==10 && !history.noStrange) ? 'Strange' : pick('Wild',    'Falling', 'Strife',  'Dark')),
    Golden:     () => historicalAges.pick((d(10)==10 && !history.noStrange) ? 'Strange' : pick('Rising',  'Tyranny', 'Strife',  'Discovery')),
    Strange:    () => historicalAges.pick()
}

history.events = new Table({
    name: "historical-events",
    keyed: true,
    content: `
Battleground            The group’s territory ended up as a battleground between two stronger rival powers, and they suffered bitterly for it.
Betrayal                Either they betrayed some trusting neighbor to a foe, or were betrayed in turn by such a false friend.
Brutal_Oppression       Some portion of the group was reduced to a state of wretched subservience by the rest.
Class Struggle          Different classes were in conflict, either subtle or overt, all seeking their own gain. 
Consequences            Pick an event of a prior age; it had long-term consequences that were good, for a bad event, or bad, for a good event.
Decadence               Old strengths and glories crumbled away into decadent remnants, the group becoming indolent and indulgent.
Depravity               Vile debauches, unclean habits, and base hungers became commonplace among the group. 
Desolation              Some portion of the group’s territory was rendered uninhabitable by something, either permanently or for a long time.
Diplomatic_Coup         The group achieved an extremely successful alliance or affiliation with a neighboring group that may yet persist.
Economic_Boom           Circumstances produced a burst of tremendous prosperity for them.
Enemies_Within          A hostile sub-group inside the group worked to do it evil, perhaps on behalf of a neighbor or due to some old grudge.
Evil_Wizard             A malevolent sorcerer, arcane cult, or other powerful magical entity caused a great deal of trouble for the group.
Exodus                  A significant chunk of the group packed up and left for some supposedly-superior land.
Exquisite_Art           The group produced art that is revered to this day, either in general or in a specific medium or form of literature.
External_War            The group faced a war with some external enemy or rival nation, with grave consequences. 
Freakish Magic          A particular type of magic was developed here that is unknown elsewhere, and its practitioners keep its secrets well.
Golden_Age              Everything went remarkably well for the group for an extended period of time, allowing prosperity and success.
Good_Wizard             Some magic-using entity of great power protected the group, taught them magic, or otherwise assisted them.
Great_Awakening         A tremendous wave of reform, purification, and re-commitment to venerable values swept through the group.
Great_Builders          The group constructed a great many vast palaces, monuments, estates, or other structures of wide fame.
Great_Infrastructure    Some tremendous work of infrastructure was accomplished: canals, vast walls, roads, aqueducts, mines, or the like.
Hero_King               Some king or other ruler achieved legendary glory in war, diplomacy, or governance. Their name is honored even today.
Immigrants              A large group of foreigners entered the land more-or-less peacefully and may or may not have been welcomed.
Inefficient_Rule        The group’s governance was impractical, inefficient, or corrupt, holding to values that turned out to be unhelpful.
Internal_War            A straight-up civil war was sparked in the group, one that involved all or many of its members.
Loss_of_Confidence      Some encounter with a new group or some shocking event made the group lose faith in its own customs and values.
Magical_Disaster        Some large-scale magical disaster scarred the group, either natural in nature or the result of someone’s sorcerous doings.
Magical_Tech            The group developed a useful and wide-spread magical tech or infrastructure that may have survived into the present.
Natural_Calamity        Earthquakes, multi-year droughts, tsunamis, meteor strikes, or some other ruins smote the group.
New_Horizons            The group discovered new territory, whether trans-dimensional, a far terrestrial region, underground realms, or the like.
New_Rulers              The group’s former ruling dynasty was replaced, either peacefully, through intrigue, or perhaps through outright conquest.
Noble_Function          Aside from the usual roles of nobles, their ruling class was all expected to fill some specific role: priest, mage, scholar, or the like.
Noble_Strife            The group’s nobility found itself embroiled in assassinations, petty wars, and mutual struggle. 
Plague                  A sickness of vast scope culled many of the group, and may yet linger in some form.
Poverty                 Circumstances conspired to reduce the group to a state of great poverty and harsh simplicity for a time.
Power_Brokers           The group was a critical regional power broker for a time, their aid or influence critical in determining who would be the hegemon.
Praetorian_Coups        Soldiers or guardsmen in service to the ruler ended up becoming the ruler’s electors or deposers.
Priest_King             One or more religions became deeply intertwined with the legitimacy of the ruling class, priests becoming nobles and vice-versa.
Rare_Resource           A uniquely valuable resource was found or manufactured by the group, which used or traded it to full effect.
Religious_Fall          A once-honored religion collapsed, perhaps through divine displeasure, human corruption, or harsh suppression.
Religious_Rise          A powerful new religion arose among the group.
Resource_Collapse       Some critical resource ran short; water, arable land, timber, magical power, or the like. 
Secession               A substantial portion of the group’s territory tried to secede from the rest, successfully or otherwise.
Terrain_Change          Some portion of the group’s land slowly changed its basic ecosystem; plains to forest, desert to savanna, or the like.
Total_Collapse          Whether due to war, civil strife, magical curses, or sheer decadence, the group’s society collapsed into anarchistic chaos for a time.
Twist_of_Fate           Roll again; if the event was positive twist it to ultimately be a negative to the group, and vice-versa.
Urbanization            One or more urban sites became unusually heavily populated, growing vastly and having a wide net of supporting towns.
Weak_Throne             The central government of the group became weak, and feudal lords or subsidiaries gained much effective independence.
Xenophilia              The group adopted many customs from their neighbors and many foreigners joined the group. 
Xenophobia              The group conceived a strong distaste for foreign people and their customs, curtailing outside contact.
`
})

history.crises = new Table({
    name: "historical-crises",
    content: `
Barbarian / monster invasion
Colonial incursion from a greater power
Decadent society or a great social evil 
Divine wrath upon them
Domineering neighbor
Economic collapse
Failed external war
Ideological divide
Incompetent governance
Internal refugees from disaster
Loss of cultural confidence
Magical calamity
Malevolent religion
Miserable poverty
Natural disasters
Noble infighting
Religious or ideological excess
Resource exhaustion
Scheming wizards
A titanic monster
Tyrannical rule
Unsuccessful expansion
Usurpers seizing control
Vicious civil warfare
War with a stronger power
`
})

history.crisisOvercome = new Table({
    name: "historical-crisis-overcome",
    content: `
A brilliant and inspirational leader arose
Organization and unity overcame the trouble 
Grim determination and enduring the evil
Faith strengthened them against the woe
Skillful use of magic resolved the problem
Martial prowess and military cunning
Diplomatic ties and outside help
Industrious labor and tireless exertion
Economic brilliance and trading acumen
Ruthless but effective sacrifices were made
`
})

history.crisisFailed = new Table({
    name: "historical-crisis-failed",
    content: `
Its people were too deeply divided
Its leadership was hopelessly inept
The gods cursed it to ruin
Decadence and self-absorption doomed it
It was vastly overconfident in its plans
Its neighbors conspired to help ruin it
It was actually two crises, and it was too much 
It was culturally exhausted and apathetic
Some tried to take advantage of the crisis
Its strengths were useless against the problem 
The crisis was far too vast and overwhelming
Some leaders were allied with the crisis
`
})