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
    IronswornStudy().run()
}

class IronswornStudy() : DeterministicStudy() {

    companion object {
        fun multiRun() {
            // rerun with dice pools from 0 to 9
            (-2 until (5)).forEach { IronswornStudy().run() }
        }
    }

    var mod = 4
    override var name = "Ironsworm Study (Deterministic): d6 + $mod vs 2d10"

    override var outcomeComparator: Comparator<Outcome>? = Comparator { o1, o2 ->
        o1.name.toInt().compareTo(o2.name.toInt())
    }

    override fun init() {

        pool.dice.add(Die("die",6))
        pool.dice.add(Die("die",6))
        pool.dice.add(Die("die",20))
        pool.dice.add(Die("die",20))
        pool.dice.add(Die("die",6))
    }

    override fun loopInit() {

    }

    override fun tally(): Outcome {

        var successes = -3
        val roll = pool.get(0) + pool.get(1) + mod
        val c1 = pool.get(2)
        val c2 = pool.get(3)
//        val match = pool.get(0) == pool.get(1)
//        val match = false
        val match = pool.get(4) >= 5
        val passes = (if (roll > c1) 1 else 0) + (if (roll > c2) 1 else 0)

        val even1 = c1 % 2 == 0
        val even2 = c2 % 2 == 0
//        val even1 = pool.get(0) % 2 == 0
//        val even2 = pool.get(1) % 2 == 0

        when (passes) {
            0 -> {
                successes = -2 + (if (match) -1 else 0)
            }

            1 -> {
//                successes = 0
//                successes = if (even1 == even2) 1 else -1
                successes = if (pool.get(4) >= 4) 1 else -1
            }

            2 -> {
                successes = 2 + (if (match) 1 else 0)
            }
        }

        return Outcome("$successes")
    }

    override fun reportOutcome(oc: Outcome): String {
        return "${oc.name}\t${oc.count}\t${oc.fractionOfTotal * 100}"
    }
}