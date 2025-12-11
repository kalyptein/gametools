package main

class DicePool(val name: String = "pool") {
    val dice = ArrayList<Die>()

    constructor(name: String, dice: Collection<Die>, isDeep: Boolean = true) : this(name) {
        dice.forEach { it
            if (isDeep) { this.dice.add(Die(it.name, it.faces.size)) } else { this.dice.add(it) }
        }
    }

    /**
     * Advance DicePool to next value (advance first die one face; if it overflows, advance the next, etc)
     */
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

    /**
     * Roll all dice in pool.
     */
    fun roll() {
        dice.forEach { it.roll() }
    }

    /**
     * Return the integer value of the specified die in the pool.
     */
    fun get(index: Int) : Int {
        return dice[index].get()
    }

    /**
     * Return number of dice in pool.
     */
    fun size() : Int {
        return dice.size
    }

    /**
     * Returns a map of DicePools of Dice with matching values (key = pool's value, value = pool).
     */
    fun getSets(sizeFirst: Boolean = true): MutableMap<Int,DicePool> {

        val sets = mutableMapOf<Int,DicePool>().withDefault { _ -> DicePool() }
        dice.forEach { sets[it.get()]?.dice?.add(it) }

        return if (sizeFirst) {
            sets.toSortedMap(compareByDescending<Int?> { sets[it]!!.size() }.thenByDescending { it })       // sort by set size, then number
        }
        else {
            sets.toSortedMap(compareByDescending<Int?> { it }.thenByDescending { sets[it]!!.size() })       // sort by number, then set size
        }
    }

    /**
     * Return the number of dice in the pool that match the specified test.
     */
    fun count(predicate: (Int) -> Boolean): Int {
        val y = dice.sumOf {
            val x = if (predicate(it.get())) 1 else 0
            x
        }
        return y
    }

    fun filter(predicate: (Int) -> Boolean, isDeep: Boolean = true): DicePool {
        return DicePool(name, dice.filter { predicate(it.get()) }, isDeep)
    }

    /**
     * Sorts the die pool using the given comparator and returns a new DicePool (shallow copy).
     */
    fun sort(comparator: Comparator<Die>, isDeep: Boolean = true): DicePool {
        val newpool = DicePool(name, dice, isDeep)
        newpool.dice.sortWith(comparator)
        return newpool
    }

    override fun toString(): String {
        return "$name [ ${dice.map { it.get() }.joinToString(", ")} ]"
    }
}