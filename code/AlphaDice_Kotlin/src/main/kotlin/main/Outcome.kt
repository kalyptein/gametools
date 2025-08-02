package main

import java.util.LinkedHashMap

// Individual outcome from one iteration of a main.Study

class Outcome(_name: String) {
    val name: String = _name
    var count: Int = 0
    var fractionOfTotal: Double = 0.0
    val tags = LinkedHashMap<String,Any>()

    fun increment(value: Int) {
        count += value
    }

    fun calcPercentage(total: Int) {
        fractionOfTotal = count.toDouble() / total.toDouble()
    }

    fun tag(key: String, value: Any) {
        tags[key] = value
    }

    override fun toString(): String {
        return "$name [n=$count]: ${tags.map { "${it.key}=${it.value}" }.joinToString(", ")}"
    }
}