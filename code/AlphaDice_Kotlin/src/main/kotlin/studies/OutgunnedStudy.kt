package studies

import main.DeterministicStudy
import main.Die
import main.MonteCarloStudy
import main.Outcome
import java.lang.Integer.max
import java.lang.Integer.min
import kotlin.math.pow

// 0d = roll 2d, basic only on a 6-6 (1-in-36), on reroll failure, botch
// 1d = roll 2d, basic only on a 4-4, 5-5 or 6-6 (1-in-12), on reroll failure, botch

// successes
// basic = 1
// critical = 3
// extreme = 9
// impossible = 27
// jackpot = 81

// roll qualities
// single roll
// risky reroll
// free reroll
// all-in (must have some success to risk)
// grit loss if this is a gamble

class OutgunnedStudy(_dice: Int) : DeterministicStudy() {

    companion object {
        fun multiRun() {
            // rerun with dice pools from 0 to 9
            (0 until (9)).forEach { OutgunnedMonteCarloStudy(1000000, it).run() }
        }
    }

    var dice = _dice
    override var name = "Outgunned Study (Deterministic): ${dice}d"

    val sets = IntArray(7) { 0 }
    var ones = 0
    var successes = 0
    val lowend = if (dice == 0) 6 else if (dice == 1) 4 else 1
    var phases = arrayOf("initial", "free", "risky", "all-in")
    var phase = 0
    var largestSet = 0

//    override var outcomeComparator = Comparator<Outcome> {o1, o2 -> (o1.name).compareTo(o2.name) }
    override var outcomeComparator: Comparator<Outcome>? = null

    override fun init() {
        val diceNum = max(dice, 2)
        val rerollDiceNum = when (dice) {
            in 0..5 -> 2 * diceNum
            6 -> 12
            else -> 10
        }
        (0 until (diceNum+rerollDiceNum)).forEach { pool.dice.add(Die("die-$it",6)) }

        // initialize outcomes
        arrayOf(-1, 0, 2, 3, 4, 5, 6).forEach {s ->
            phases.forEach {p ->
                val oc = Outcome("$s $p")
                oc.tag("gamble", 0)
                oc.tag("successes", s)
                oc.tag("phase", p)
                result.outcomes[oc.name] = oc
            }
        }
    }

    override fun loopInit() {
        (0..6).forEach { sets[it] = 0 }
        ones = 0
        successes = 0
    }

    override fun run() {
        init()

        while (!end) {
            loopInit()

            // initial roll
            phase = 0
            gatherSets()
            result.addOutcome(tally())
            var priorSuccesses = successes

            // reroll
            reroll()
            gatherSets()

            // free reroll
            phase = 1
            result.addOutcome(tally())

            // risky reroll
            phase = 2
            if (successes <= priorSuccesses) {
                // decrement largest set and recalc successes
                sets[largestSet] = max(0, sets[largestSet]-1)
                successes = 0
                (lowend..6).forEach {
                    if (sets[it] > 1) {
                        successes += max(81, ((3.0).pow(sets[it]-2)).toInt())
                    }
                }
            }
            result.addOutcome(tally())
            priorSuccesses = successes

            // all-in (allowed if successes not already zeroed out)
            phase = 3
            if (successes > 0) {
                gatherSets()
                reroll()
                gatherSets()
                // if outcome not improved, failure
                if (successes <= priorSuccesses) {
                    successes = 0
                }
            }
            else {
                successes = 0
            }
            result.addOutcome(tally())

            next()
        }

        // calc gamble hit average
        result.outcomes.values.forEach {
            val g = it.tags["gamble"] as Int
            it.tag("gamble", g.toDouble() / it.count.toDouble())
        }

        report()
    }

    override fun tally(): Outcome {
        val successLevel = when (successes) {
            0 -> 0
            in 1..2 -> 2
            in 3..8 -> 3
            in 9..26 -> 4
            in 27..80 -> 5
            else -> 6
        }

        val name = "$successLevel ${phases[phase]}"
        val oc = result.outcomes[name]!!
        val oneTotal = oc.tags["gamble"] as Int
        oc.tag("gamble", oneTotal + ones)
        return oc
    }

    override fun reportOutcome(oc: Outcome): String {
        return "${oc.name}\t${oc.tags["successes"]}\t${oc.tags["phase"]}\t${oc.tags["gamble"]}\t${oc.count}\t${oc.fractionOfTotal * 100}"
    }

    fun gatherSets() {
        (0..6).forEach { sets[it] = 0 }
        pool.dice.forEach { sets[it.get()] = min(sets[it.get()] + 1, 6) }
        ones = sets[1]

        largestSet = 0
        sets.forEach { if (it >= largestSet) largestSet = it }

        successes = 0
        (lowend..6).forEach {
            if (sets[it] > 1) {
                successes += max(81, ((3.0).pow(sets[it]-2)).toInt())
            }
        }
    }

    // TODO update for deterministic
    fun reroll() {
        // reroll any dice not part of a set of 2 or more
        (1..6).forEach {
            if (sets[it] < 2) {
                pool.dice.filter { it2 -> it2.get() == it }.forEach { it3 -> it3.roll() }
            }
        }
    }
}