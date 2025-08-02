package main
// Groups of Outcomes, the product of a main.Study

class Result {
    val outcomes: LinkedHashMap<String, Outcome> = LinkedHashMap()
    var totalCount: Int = 0

    fun addOutcome(oc: Outcome) {
        // create outcome if no prior instances exist
        if (outcomes[oc.name] == null) {
            outcomes[oc.name] = oc
        }

        // increment outcome total and update percentage
        totalCount++
        outcomes[oc.name]?.increment(1)
        outcomes[oc.name]?.calcPercentage(totalCount)
    }
}