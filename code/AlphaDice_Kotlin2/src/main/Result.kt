package main

import java.util.SortedMap

// Groups of Outcomes, the product of a main.Study

class Result() {
    val outcomes: SortedMap<String, Outcome> = LinkedHashMap<String, Outcome>().toSortedMap()

    fun addOutcome(name: String) {
        addOutcome(Outcome(name, 0))
    }

    fun addOutcome(oc: Outcome) {
        // create outcome if no prior instances exist
        if (outcomes[oc.name] == null) {
            outcomes[oc.name] = oc
        }

        outcomes[oc.name]?.increment(1)
    }

    fun calcPercentage(outcome: Outcome, totalCount: Int = totalCount()): Double {
        return outcome.count.toDouble() / totalCount.toDouble()
    }

    fun calcPercentage(predicate: (Outcome) -> Boolean, totalCount: Int = totalCount()): Double {
        return count(predicate).toDouble() / totalCount.toDouble()
    }

    fun count(predicate: (Outcome) -> Boolean): Int {
        return outcomes.values.sumOf { if (predicate(it)) it.count else 0 }
    }

    fun totalCount(): Int {
        return outcomes.values.sumOf { it.count }
    }

    fun sort(comparator: Comparator<String>): SortedMap<String, Outcome> {
        return this.outcomes.toSortedMap(comparator)
    }

    fun filter(predicate: (Outcome) -> Boolean): Result {
        val newresult = Result()
        outcomes.values.forEach { if (predicate(it)) { newresult.outcomes[it.name] = it } }
        return newresult
    }
}