package main

class Die(name: String, vararg face: Int) {
    var faces = face.toList().toTypedArray()
    var index = 0
    var name = name

    constructor(name: String, dieSize: Int) : this(name, *(1..dieSize).toList().toIntArray())

    /**
     *  Shift die to next face.
     */
    fun next(): Boolean {

        // die rolls over, next = true
        index++
        if (index >= faces.size) {
            index = 0
            return true
        }
        return false
    }

    /**
     *  Get die's integer value.
     */
    fun get(): Int {
        return faces[index]
    }

    /**
     *  Roll the die to a random face.
     */
    fun roll() {
        index = Study.random.nextInt(0, faces.size)
    }

    /**
     *  Apply an arbitrary test to the die and return if it matches or not.
     */
    fun test(predicate: (Int) -> Boolean): Boolean {
        return predicate(get())
    }

    override fun toString(): String {
        return "$name: ${get()} (i=$index)"
    }

    override fun equals(other: Any?): Boolean {
        return (other is Die) && (get() == other.get())
    }

    fun compareTo(other: Die): Int {
        return this.get().compareTo(other.get())
    }

    override fun hashCode(): Int {
        var result = index
        result = 31 * result + faces.contentHashCode()
        result = 31 * result + name.hashCode()
        return result
    }
}