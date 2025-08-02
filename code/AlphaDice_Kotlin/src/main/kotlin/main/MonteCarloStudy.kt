package main

import kotlin.random.Random

abstract class MonteCarloStudy(_iter: Int): Study() {

    var iterations = _iter

    override fun run() {
        init()
        next()      // initial randomization

        for (i: Int in 1..iterations) {
            loopInit()
            result.addOutcome(tally())
            next()
        }

        report()
    }

    /** Randomize dice pool state */
    override fun next() {
        pool.roll()
    }

    override fun report() {
        println("\nseed: ${Study.seed}")
        super.report()
    }
}