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

//    UnderclockStudy(1000000).run()

//    OutgunnedMonteCarloStudy.multiRun()
    IronswornStudy_RebelScum().run()
}

class IronswornStudy_RebelScum() : DeterministicStudy() {

    companion object {
        fun multiRun() {
            // rerun with dice pools from 0 to 9
            (-2 until (5)).forEach { IronswornStudy().run() }
        }
    }

    var mod = 0
    var skill = 5
    var dif = 0
    override var name = "Ironsworm Study (Deterministic): 2d6 + $mod vs 1d10"

    override var outcomeComparator: Comparator<Outcome>? = Comparator { o1, o2 ->
        o1.name.toInt().compareTo(o2.name.toInt())
    }

    override fun init() {

        pool.dice.add(Die("die",10))
        pool.dice.add(Die("die",10))
        pool.dice.add(Die("die",10))
    }

    override fun loopInit() {

    }

    override fun tally(): Outcome {

        var successes = -5
        val d1 = pool.get(0)
        val d2 = pool.get(1)
        val d3 = pool.get(2)
        val p1 = if (d1 <= skill && d1 > dif) 1 else 0
        val p2 = if (d2 <= skill && d2 > dif) 1 else 0
        val p3 = if (d3 <= skill && d3 > dif) 1 else 0
        val match = (d1 == d2) || (d1 == d3) || (d2 == d3)

        val passes = (p1 + p2 + p3)

        successes = passes
        when (passes) {
            0 -> {
                successes += if (match) -1 else 0
            }

            0 -> {
//                successes += if (d1 > d2) 1 else if (d1 < d2) -1 else 0
            }

            3 -> {
                successes += if (match) 1 else 0
            }
        }

        return Outcome("$successes")
    }

    override fun reportOutcome(oc: Outcome): String {
        return "${oc.name}\t${oc.count}\t${oc.fractionOfTotal * 100}"
    }
}