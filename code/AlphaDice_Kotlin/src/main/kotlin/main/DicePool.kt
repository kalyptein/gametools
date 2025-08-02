package main

class DicePool(val name: String = "pool") {
    val dice = ArrayList<Die>()

    fun next(): Boolean {
        var index = 0

        while (dice[index].next()) {
            index++

            // pool complete, end = true
            if (index >= dice.size) {
                return true
            }
        }

        return false
    }

    fun roll() {
        dice.forEach { it.roll() }
    }

    fun get(index: Int) : Int {
        return dice[index].get()
    }

    override fun toString(): String {
        return "$name [ ${dice.map { it.get() }.joinToString(", ")} ]"
    }

    /** Returns a map of sets of the same value (key = rolled value, value = size of set)
     */
    fun getSets(): MutableMap<Int,Int> {
        val sets = mutableMapOf<Int,Int>().withDefault { _ -> 0 }
        dice.forEach {
            val value = it.get()
            sets[value] = sets.getValue(value)!! + 1
        }
        return sets.toSortedMap(compareByDescending<Int?> { sets[it] }.thenByDescending { it })       // sort by value (set size), then number
    }

    fun count(predicate: (Int) -> Boolean): Int {
        val y = dice.map {
            val x = if (it.test(predicate)) 1 else 0
            x
        }.sum()
        return y
    }
}