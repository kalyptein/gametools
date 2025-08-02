package main

import kotlin.random.Random

abstract class Study {

    companion object {
        val seed = System.currentTimeMillis()
        val random = Random(seed)
    }

    abstract var name: String

    val pool = DicePool()
//    val result: Result = Result()
    val results = LinkedHashMap<String,Result>()
    var end = false

    /** Sorts outcome names for report, defaults to string natural order of outcome name */
    open var outcomeComparator: Comparator<Outcome>? = Comparator { o1, o2 -> o1.name.compareTo(o2.name) }

    /** Run study */
    abstract fun run()

    /** Set up initial conditions */
    abstract fun init()

    /** Initialize conditions at start of loop iteration */
    abstract fun loopInit()

    /** Advance to next dice pool state */
    abstract fun next()

    /** Calculate outcome value from current dice pool state */
    abstract fun tally(): Outcome

    /** Format outcome data for reporting */
    abstract fun reportOutcome(oc: Outcome): String

    /** Display study results */
    open fun report() {

        println("\n$name\n")

        results.values.forEach { result ->
            var list = result.outcomes.values.toList()
            if (outcomeComparator != null) { list = list.sortedWith(outcomeComparator!!) }

            println("iterations: ${result.totalCount}\n")

            list.forEach { outcome ->
                outcome.calcPercentage(result.totalCount)
                val out = reportOutcome(outcome)
                println(out)
            }
        }
    }
}