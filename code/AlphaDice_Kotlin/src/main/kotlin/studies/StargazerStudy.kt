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

    StargazerStudy.multiRun()
//    StargazerStudy().run()
}

class StargazerStudy(var size: Int) : DeterministicStudy() {

    companion object {
        fun multiRun() {
            // rerun with dice pools from 0 to 9
            (1 until 11).forEach {
                StargazerStudy(it).run()
            }
        }
    }

    override var name = "Stargazer Study (Deterministic) - ${size}d"

    override var outcomeComparator: Comparator<Outcome>? = Comparator { o1, o2 ->
        o1.name.toInt().compareTo(o2.name.toInt())
    }

    override fun init() {

        // build dicepool
        (0 until size).forEach {
            pool.dice.add(Die("die",10))
        }
    }

    override fun loopInit() {

    }

    override fun tally(): Outcome {

//        val sixes = pool.count{ v -> v >= 5 }
        val sixes = pool.count{ v -> v >= 8 }
//        val outcome = sixes + tens
        val outcome = sixes.coerceAtMost(3)

//        val outcome = when {
//            sixes == 0 -> 0
////            {
////                val upper = pool.count { v -> v >= 3 }
////                if (upper <= 0) -1 else 0
////                }
//            sixes == 1 -> 1
//            sixes == 2 -> 2
//            else -> 3
//        }

        return Outcome("$outcome")
    }

    override fun reportOutcome(oc: Outcome): String {
        return "${oc.name}\t${oc.count}\t${oc.fractionOfTotal * 100}"
    }
}