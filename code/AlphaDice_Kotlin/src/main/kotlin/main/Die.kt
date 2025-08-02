package main

import kotlin.random.Random

class Die(_name: String, vararg _face: Int) {
    var faces = _face.toList().toTypedArray()
    var index = 0
    var name = _name

    constructor(_name: String, dieSize: Int) : this(_name, *(1..dieSize).toList().toIntArray())

    fun next(): Boolean {

        // die rolls over, next = true
        index++
        if (index >= faces.size) {
            index = 0
            return true
        }
        return false
    }

    fun get(): Int {
        return faces[index]
    }

    fun roll() {
        index = Study.random.nextInt(0, faces.size)
    }

    override fun toString(): String {
        return "$name: ${get()} (i=$index)"
    }

    fun test(predicate: (Int) -> Boolean): Boolean {
        val x = predicate(get())
        return x
    }
}