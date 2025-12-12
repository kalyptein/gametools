package studies

import main.DeterministicStudy
import main.Die
import main.Outcome

val isBoon = true
val diesize = 6

val critsize = 10
val critThreshold = 9
val missThreshold = 2

fun main(args: Array<String>) {

     multiRun()

//    val poolsize = 1
//    CraveAutohitStudy("Crave Autohit Study (Deterministic): ${poolsize}d${diesize}, crit(${critThreshold}+ on d${critsize})", poolsize).run()
}

fun multiRun() {
    (1 until (6)).forEach {
        CraveAutohitStudy("Crave Autohit Study (Deterministic): ${it}d${diesize}, crit(${critThreshold}+ on d${critsize})", it).run()
    }
}

class CraveAutohitStudy(name: String, val poolsize: Int) : DeterministicStudy(name) {

    override fun init() {

        pool.dice.add(Die("crit-die",critsize))                               // crit die
        (0 until (poolsize)).forEach { pool.dice.add(Die("die",diesize)) }       // regular dice
    }

    override fun sortOutcomes(list: List<Outcome>): List<Outcome> {
        return list.sortedWith(Comparator.comparing { it.name.toInt() })
    }

    override fun tally(): Outcome {

        val critRoll = pool.get(0)

        val sets = pool.subpool(1, pool.dice.size, false).getSets(false)
        val roll = if (isBoon) { sets.firstKey() } else { sets.lastKey() }
        val size = (sets[roll]?.size()) ?: 0

        // if max die value = 1 -> 0 (Miss)
//        var total = if (roll == 1) 0 else roll
        var total = if (critRoll <= missThreshold) 0 else roll

        if (total > 0) {
            // if max die value -> crit
            if (critRoll >= critThreshold) {
                total += diesize
            }

            // if boon and multimatch highest
            if (isBoon) {
                total += (size-1) * 2
            }
        }

        return Outcome("$total")
    }
}