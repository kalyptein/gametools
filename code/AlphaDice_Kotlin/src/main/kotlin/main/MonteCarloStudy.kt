package main

import kotlin.random.Random

abstract class MonteCarloStudy(_iter: Int): Study() {

    var iterations = _iter

    override fun run() {

        results["result"] = Result()
        init()
        next()      // initial randomization

        for (i: Int in 1..iterations) {
            loopInit()
            results["result"]?.addOutcome(tally())      // refactor to work w/ multiple results
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