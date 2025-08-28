// History PCG

import { m, Table, d, RANGE, WEIGHT, pick, tables } from "../scripts/utils.js"

export const history = { }
export default history

const debug = false

export const ageList = ['Wild', 'Falling', 'Rising', 'Tyranny', 'Strife', 'Discovery', 'Dark', 'Decay', 'Placid', 'Golden', 'Strange']
export const strangeList = ['', 'Combo', 'Wonders', 'Lost', 'Discontinuity']

history.ages = (roll=undefined, strangeRoll=undefined, comboRoll=undefined) => {
    let age = historicalAges.pick(roll)
    if (history.noStrange) { strangeRoll = 'Normal' }
    age.strange = historicalAgeStrange.pick(strangeRoll)
    if (age.strange.key == 'Combo') { age.combo = history.ages(comboRoll, 'Normal') }
    return age
}

history.noStrange = false

let historicalAges = new Table({
    name: "historical-ages",
    // defaultRoll: () => d(100),
    index: WEIGHT,
    keyed: true,
    content: `
11      Wild            Civilization is frail, the wild is strong
11      Falling         Fragmentation, division, loss of connection, loss of unity
11      Rising          Unification, codification, connecting, developing
11      Tyranny         Authoritarianism, dictatorship, oppression
11      Strife          Hardship, conflict, intrigue, upheaval, disaster
11      Discovery       New lands, new developments, new culture, new thought
11      Dark            Ruins, ignorance, rule by strongmen, poverty
11      Decay           Decadence, lethargy, ossification, paralysis
6       Placid          Simple times, peaceful
6       Golden          Glory, prosperity, grandeur
`
})

let historicalAgeStrange = new Table({
    name: "historical-age-strange",
    index: WEIGHT,
    keyed: true,
    content: `
1     Combo           Combo
1     Wonders         Age of Wonders
1     Lost            Lost Age
1     Discontinuity   Discontinuity
36    Normal          Not Strange
`
})

history.leadsTo = {
    name:       "historical-age-leads-to", 
    Wild:          () => history.ages(pick('Rising',  'Strife',  'Discovery', 'Dark',      'Placid')),
    Falling:       () => history.ages(pick('Wild',    'Rising',  'Tyranny',   'Strife',    'Discovery', 'Dark',      'Placid')),
    Rising:        () => history.ages(pick('Falling', 'Tyranny', 'Strife',    'Discovery', 'Golden',    'Decay')),
    Tyranny:       () => history.ages(pick('Falling', 'Rising',  'Strife',    'Discovery', 'Dark',      'Golden',    'Decay')),
    Strife:        () => history.ages(pick('Wild',    'Falling', 'Rising',    'Tyranny',   'Dark',      'Placid',    'Golden', 'Decay')),
    Discovery:     () => history.ages(pick('Falling', 'Rising',  'Tyranny',   'Strife',    'Golden',    'Decay')),
    Dark:          () => history.ages(pick('Wild',    'Rising',  'Tyranny',   'Strife',    'Discovery', 'Placid')),
    Decay:         () => history.ages(pick('Wild',    'Falling', 'Rising',    'Tyranny',   'Strife',    'Discovery', 'Dark',   'Placid')),
    Placid:        () => history.ages(pick('Wild',    'Rising',  'Strife',    'Discovery')),
    Golden:        () => history.ages(pick('Falling', 'Tyranny', 'Strife',    'Discovery', 'Decay')),
    Discontinuity: () => historicalAges.pick(),
}
tables["historical-age-leads-to"] = history.leadsTo


history.arisesFrom = {
    name:       "historical-age-arises-from",
    Wild:       () => history.ages(pick('Falling', 'Strife',  'Dark',    'Placid')),
    Falling:    () => history.ages(pick('Rising',  'Tyranny', 'Strife',  'Discovery', 'Golden')),
    Rising:     () => history.ages(pick('Wild',    'Falling', 'Tyranny', 'Strife',    'Discovery', 'Dark',   'Placid')),
    Tyranny:    () => history.ages(pick('Rising',  'Falling', 'Strife',  'Discovery', 'Dark',      'Golden')),
    Strife:     () => history.ages(pick('Wild',    'Rising',  'Falling', 'Tyranny',   'Discovery', 'Dark',   'Placid', 'Golden')),
    Discovery:  () => history.ages(pick('Wild',    'Rising',  'Falling', 'Tyranny',   'Dark',      'Placid', 'Golden')),
    Dark:       () => history.ages(pick('Wild',    'Falling', 'Tyranny', 'Strife')),
    Decay:      () => history.ages(pick('Rising',  'Tyranny', 'Strife',  'Discovery', 'Golden')),
    Placid:     () => history.ages(pick('Wild',    'Falling', 'Strife',  'Dark')),
    Golden:     () => history.ages(pick('Rising',  'Tyranny', 'Strife',  'Discovery')),
}
tables["historical-age-arises-from"] = history.arisesFrom


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

history.ageDescriptions = {}

history.ageDescriptions.Wild = `
- Nature is powerful and civilization is scattered or sparse, focused on acquiring basic resources and security. Populations are small, and institutions are few and simple.
- Primeval, prehistoric times, a newly opened frontier, a tribal equilibrium with its environment, the aftermath of a fall or disaster, or the rise of the Powers of nature overcoming civilization.
- Touchstones: an apex predator or kaiju, a nature spirit, the cause of civilization's collapse, a lone hermit, a tribe, the one bordertown / holdout / intrusion of civilization.
`

history.ageDescriptions.Falling = `
- Division, sundering, decentralization, factionalization, simplification, fragmentation, scattering, collapse, devolution
- Civilization is more spread out and decentralized in smaller groups, either because it hasn't risen that high to begin with, or because some larger structures break down or disperse. Knowledge or capabilities may be lost or dormant (unable to be used), but not to the extent of a Dark age.
- Factionalization, balkanization of society and politics. Could lead to or be caused by a breakdown in communication or transport systems, or loss of faith in a centralizing institution or unifying figure.
`

history.ageDescriptions.Rising = `
- The age is marked by the building up of complexity and unification.
- Cities combine (or are combined) into nations, smaller guilds and businesses are bought up by bigger ones. Settlements connect and trade flows. Factions ally and unite. Laws, institutions, standards and bureaucracy are codified and multiplied. Learning is systematized; peoples may be brought beneath dominant religions or philosophies.
- Some groups may prosper in a time of hope and progress, others might crushed in the process of unification, or see their local power lost to some distant imperial center. People scramble to rise to the new heights of wealth, power, and influence the age creates.
- Touchstones: a dominant ideology or religion, a great unifier, an important act or law, a group rising to power, a group losing ancient rights or authority to the new, a gold rush or boomtown, a crucial battle that marked the passing of the old / the rise of the new, a new territory incorporated, establishment of a new system of government / dynasty / capital, an important marriage or alliance, a new school, military order, guild, or religious institution, an influx of wealth, new means of communication or transport.
`

history.ageDescriptions.Tyranny = `
- Civilization is marked by iron-fisted rule. It could be a "at least the trains run on time" fascism, a universally miserable "ground beneath the boot-heel" brutality, a rigid ideological/religious orthodoxy that brooks no heretics, or a genteel veneer ruthlessly maintained by hidden enforcers.
- The age may be marked by rebellions, secret police, internal intrigue, brutal spectacle, jingoistic expansionism, and perhaps some manner of bread-and-circuses.
- Tyranny may be imposed from within, or by an outside conqueror. It may justify itself as the only bulwark against some dire internal or external threat.
- A tyranny could burn out in a single reign, last for the unnatural span of the tyrant's supernatural longevity, or become an institution that survives many successions.
- Life-or-death intrigues often swirl just under the surface, either for true mastery, or as transient factions rise and fall under the gaze of the unquestionable tyrant.
- Touchstones: the institution of oppression, the tyrant, chief enforcer or spymaster, a rebel group, an infamous pogrom or defeat for freedom, classes of oligarchs or nobles who support and benefit from the tyranny, a scapegoated or uniquely oppressed underclass, the usurped rightful authority in-exile, the unstoppable weapon or legion that secures the iron grip
`

history.ageDescriptions.Strife = `
- Includes hardship in general: war, disaster, famine, plague, unrest, shadow conflicts, shortages, monsters, etc
- War, revolution/rebellion, riots, warlordism, banditry, civil war/schism, factionalization, in-fighting, mistrust, pogroms, ideological/ethnic extremism, authoritarianism & pushback, inter-civilizational clash, external wars, invasion, destruction of infrastructure, opportunism & profiteering, locust-like consumption of resources.
- Social/military conflict may be accompanied/triggered/worsened by natural disasters, climate shifts, etc.
- Marked by refugees / dislocation, plunder, enslavement, intrigue, assassination, political clashes, street violence, breakdown of law, or other widespread, prolonged disruption. Civilization may or may not collapse, but it is on the defensive against internal or external chaos.
`

history.ageDescriptions.Discovery = `
- Exploration, intellectual ferment, new forms of art & culture, discovery, invention, neophilia, social/political liberalization & paradigm shift, social fluidity, civilizational decalcification, new loci of wealth and power, connection to new regions, reactionary backlash.
- The powers of the region may reach out to explore and contact other regions. This may bring in a boom off trade and learning, intermix populations, spread philosophies and ideas, seed colonies, or spur inter-region invasion/conquest.
- Not the pinnacle of a Golden Age, but it might be leading there. Usually a time of hope and progress.
- New inventions, new political structures/groups, new lines of trade and communication, new cities. People scramble for a piece of the pie and flock to the centers of the new.
- Touchstones: a new discovery, a new institution, a clash between a group or institution of the past and one of the future
`

history.ageDescriptions.Dark = `
- A time of ignorance, poverty, and strife. Sparks of a better past might be treasured, hoarded, or feared. People turn to xenophobia, robbery, and cults in search of power or security. Authority is fragmented, sparse, and illegitimate.
- Keepers of past knowledge or possessions guard them jealously and hide them from thieves, ignorant mobs, or dogmatic zealots.
- Life is nasty, brutish, and short. Circumstances can range from the merely fallen to the fully post-apocalyptic. The population could be large but locked in ignorance and a crude mockery of civilization, or scattered and fragmented, with little communication between pockets of habitation.
- Touchstones: a keeper of the past martyred by warlords, xenophobic priests, a howling mob, oligarchs/warlords with control of some power or resource of the past
`

history.ageDescriptions.Decay = `
- Civilization gradually weakens. Decadence, ossification, and stagnation slowly strangle initiative, but inertia preserves the shell of a more vital civilization.
- Things are lost and forgotten; people rest on past glories, rather than matching or surpassing them. Institutions, infrastructure, and culture slowly crumbles, unmaintained or renewed. What new is built is overshadowed by what came before. Ennui, intrigue, and jaded tastes bring out the worst in people. Grotesqueries and perversions can become celebrated, novel enough to penetrate the numbing haze.
- Things are falling apart, social structures ossify, but society persists as it was, for now. There may be unrest, but it's not acute yet. There is intrigue as people wrestle over a static or shrinking pie. Corruption grows, and law breaks down as you move away from centers of power.
- People look to the past, or distract themselves in the now with indulgence, empty formality, or recursive culture. Traditionalists may cling tighter and more rigidly to the glories, systems, or philosophies of the past, obsessing over their minutia in a strangling attempt to hold on.
- Touchstones: the last good leader, the first of the weak or foolish leaders, something extravagant produced while ordinary people slide into poverty and infrastructure decays, important lore or capability lost during the age, an oppressive institution that contributes to the decay, a decadent pastime that arises, an empty formalist artistic school, an over-elaborate forms of etiquette, a stultifying traditionalist movement.
`

history.ageDescriptions.Placid = `
- A time of calm, peace, and relative contentment.
- Institutions work and remain fairly constant. No upheavals or privations batter civilization, but there are no great opportunities or intellectual ferment.
- Conformity and tradition are likely to be prized over achievement. Petty politics and status games may dominate the attention of the people or leaders, or there may be true harmony.
- This could be a stable, large-scale civilization coasting along in stasis, or decentralized communities living in pastoral bliss. They may grow soft, stagnant, insular, or self-satisfied, or they may be hearty folk who eschew the lure of ambition. Lack of urgency may cause a forgetting of important things, or the atrophy of former skills or knowledge.
- Touchstones: a forgotten danger, an old skill now faded, a relic of a more tumultuous or glorious time, the founder of the lasting peace or the ruler who allowed former grandeur to fade, an unusual status game or form of conflict resolution, a community festival or ritual, a group quietly maintaining the old lore (as a curiosity or against a time of need)
`

history.ageDescriptions.Golden = `
- A glorious pinnacle of art, culture, learning, power, wealth, prosperity, security, peace, dominance, and/or military power.
- It will likely by mythologized by later ages, and things connected to it may be seen as sources of authority, legitimacy, virtue, and sophistication.
- It may or may not have been equally great for everyone (and might have sucked for some underclass or external colonized people).
- It leaves lots of ruins, artifacts, lore, great works, and lost secrets. Later ages may seek to relearn / rebuild / recreate / hoard its achievements.
- Touchstones: a place the epitomizes the golden age (palace, capital city, great canal, flying fortress, etc), a great treasure, the leader who founded the Golden Age or presided over it, a form of power or knowledge developed or perfected, an enemy or hardship overcome to usher in the age or preserve its continuation, a tradition or term hearkening to the age
`

history.ageDescriptions.Wonders = `
- Like one of the other types of ages, but characterized or initiated by a really dramatic expression of power. God descend to earth, archmages wield high magic, magi/tech is commonplace, supernatural disasters or curses devastate the land, monsters or titans emerge, etc.
- If the setting is already high powered, this may not be particularly relevant; don't skimp on amazing stuff in the "normal" ages, just because this is a possibility. And skip this age if it conflicts with the tone of a low powered setting.
- Consider why the age comes to an end. Do the unleashed powers leave? Become dormant or sealed away? Mutually destroy or nullify each other? Become normalized and democratized?
Examples
    A Wild Age where kaiju level cities and dominate a land of cowering tribal survivors.
    A Falling Age in which the fragmentation of a magical tradition leads to rival kingdoms of element-benders.
    A Rising Age in which dragon-riders conquer and unify a continent of squabbling kingdoms.
    An Age of Tyranny brought on by mass enslavement by psionic tyrants.
    An Age of Strife caused when the gods bring their war to earth.
    An Age of Discovery caused by the opening of portals to new worlds.
    A Dark Age filled with the endless clash of mythic, heavy metal war-gods and their howling hordes.
    An Ag of Decay under an emperor whose court hosts monstrous expressions of decadence and excess.
    A Placid Age in which magic is sealed away and peace enforced by angelic warriors.
    A Golden Age with floating cities and flying ships.
`

history.ageDescriptions.Lost = `
- The details of this age are lost or obscured, either immediately or by the passage of time. They might be lost due to destruction in this or a subsequent age, intentionally obscured by historians, a victorious ruler, or a secret society. The people of the age itself (or some portion of them) may have sought to limit knowledge.
- The nature of the age might be misrepresented or inverted, or the existence of the age itself might be lost. Its study might be a field of scholarship, or it might remain only in scraps of legend told around campfires.
- You can roll up a normal age type (or a series of several) to see what was actually going on, or just leave this age as a mysterious lacuna or discontinuity.
`
