package studies

import main.DeterministicStudy
import main.Die
import main.Outcome

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

fun main(args: Array<String>) {

    // Try adding program arguments via Run/Debug configuration.
    // Learn more about running applications: https://www.jetbrains.com/help/idea/running-applications.html.
//    println("Program arguments: ${args.joinToString()}")

    // CraveAutohitStudy.multiRun()
    CraveAutohitStudy().run()
}

class CraveAutohitStudy() : DeterministicStudy() {

    companion object {
        fun multiRun() {
            // rerun with dice pools from 0 to 9
            (-4 until (4)).forEach { CraveAutohitStudy().run() }
        }
    }

    // var mod = 4
    override var name = "Crave Autohit Study (Deterministic)"

        val isBoon = true
        val poolsize = 1
        val diesize = 6
        val critThreshold = 6

    // override var outcomeComparator: Comparator<Outcome>? = Comparator { o1, o2 ->
    //     o1.name.toInt().compareTo(o2.name.toInt())
    // }

    override fun init() {

        (0 until (poolsize)).forEach { pool.dice.add(Die("die",diesize)) }
    }

    override fun loopInit() {

    }

    override fun tally(): Outcome {

        var total = 0
        var sets = null
        var roll = 0
        var size = 1

        if (isBoon) {
            // naked or boon roll: get highest roll, and number of matches
            sets = pool.getSets().toSortedMap(compareByDescending<Int?> { it }.thenByDescending { sets[it] })
            roll = sets.get(0).key
            size = sets.get(0).value
        }
        else {
            // bane roll: get lowest roll
            sets = pool.getSets().toSortedMap(compareByAscending<Int?> { it }.thenByAscending { sets[it] })
            roll = sets.get(0).key
            size = 1
        }

        // if max die value = 1 -> 0
        total = if (roll == 1) 0 else roll

        // if max die value -> crit
        if (roll >= critThreshold) {
            // TODO need an extra die for this
        }

        // if boon and multimatch highest
        if (isBoon) {
            total += (size-1) * 2
        }

        return Outcome("${total}")
    }

    override fun reportOutcome(oc: Outcome): String {
        return "${oc.name}\t${oc.count}\t${oc.fractionOfTotal * 100}"
    }
}