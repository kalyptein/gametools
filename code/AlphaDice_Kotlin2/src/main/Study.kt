package main

import kotlin.random.Random

abstract class Study(var name: String = "Study", vararg resultGroups: String) {

    companion object {
        val seed = System.currentTimeMillis()
        val random = Random(seed)
    }

    val pool = DicePool()
    val result = LinkedHashMap<String,Result>()
    var end = false

    init {
        if (resultGroups.isNotEmpty()) {
            resultGroups.forEach { result[it] = Result() }
        } else {
            result["result"] = Result()
        }
    }

    /** Set up initial conditions */
    abstract fun init()

    /** Initialize conditions at start of loop iteration */
    open fun loopInit() { }

    /** Run study */
    abstract fun run()

    /** Advance to next dice pool state */
    abstract fun next()

    /** Calculate outcome value from current dice pool state */
    abstract fun tally(): Outcome

    /** Place tally into results */
    open fun handleOutcome() {
        result["result"]?.addOutcome(tally())      // refactor to work w/ multiple results
    }

    /** Format outcome data for reporting */
    open fun reportOutcome(oc: Outcome): String {
        if (result["result"] != null) {
            val fractionOfTotal = result["result"]!!.calcPercentage(oc, result["result"]!!.totalCount())
            return "${oc.name}\t${oc.count}\t${fractionOfTotal * 100}"
        }
        else {
            return "null result, can't parse"
        }
    }

    /** Display study results */
    open fun report() {

        println("\n$name\n")

        result.entries.forEach { result ->
            val list = result.value.outcomes.values.toList()
            val totalCount = result.value.totalCount()

            println("result: ${result.key}")
            println("iterations: ${totalCount}\n")

            list.forEach { println(reportOutcome(it)) }
        }
    }
}