package main

import java.util.LinkedHashMap

// Individual outcome from one iteration of a main.Study

class Outcome(val name: String, var count: Int = 0, vararg tags: String) {
    var tags = LinkedHashMap<String,Any?>(tags.associateWith { true })

    fun increment(value: Int = 1) {
        count += value
    }

    fun put(key: String, value: Any) {
        tags[key] = value
    }

    fun has(key: String): Boolean {
        return tags[key] != null
    }

    fun get(key: String): Any? {
        return tags[key]
    }

    override fun toString(): String {
        return "$name [n=$count]: ${tags.map { "${it.key}=${it.value}" }.joinToString(", ")}"
    }

    override fun equals(other: Any?): Boolean {
        return (other is Outcome) && (name == other.name)
    }

    override fun hashCode(): Int {
        var result = count
        result = 31 * result + name.hashCode()
        result = 31 * result + tags.hashCode()
        return result
    }
}