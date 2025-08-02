package studies

import main.Die
import main.MonteCarloStudy
import main.Outcome

class UnderclockStudy(_iter: Int) : MonteCarloStudy(_iter) {

    override var name = "Underclock Study"

    var clock = 0
    var rolls = 0
    var omens = 0

    override var outcomeComparator: Comparator<Outcome>? = Comparator { o1, o2 ->
        val rolls1: Int = o1.tags["rolls"] as Int
        val rolls2: Int = o2.tags["rolls"] as Int
        val omens1: Int = o1.tags["omens"] as Int
        val omens2: Int = o2.tags["omens"] as Int

        if (rolls1 > rolls2)  1
        else if (rolls1 < rolls2) -1
        else {
            if (omens1 > omens2)  1
            else if (omens1 < omens2) -1
            else 0
        }
    }

    override fun init() {
        pool.dice.add(Die("die",6))
    }

    override fun loopInit() {
        clock = 20
        rolls = 0
        omens = 0
    }

    override fun tally(): Outcome {

        // keep rolling dice until below 0, omen on 3, reset to 3 on 0
        // 6s explode into d6-1
        while (clock >= 0) {
            pool.roll()
            var rt = pool.get(0)
            while (pool.get(0) == 6) {
                pool.roll()
                rt += pool.get(0)-1
            }

            rolls++
            clock -= rt

            if (clock == 0) { clock = 3 }
            if (clock == 3) { omens++ }
        }

        omens = if (omens > 0) 1 else 0

        var oc = Outcome("$rolls rolls, ${omens} omens")
        oc.tag("rolls", rolls)
        oc.tag("omens", omens)
        return oc
    }

    override fun reportOutcome(oc: Outcome): String {
        return "${oc.tags["rolls"]}\t${oc.tags["omens"]}\t${oc.count}\t\t${oc.fractionOfTotal * 100}"
    }
}