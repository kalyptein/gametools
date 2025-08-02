package main

import kotlin.random.Random

abstract class DeterministicStudy : Study() {

    override fun run() {
        init()

        while (!end) {
            loopInit()
            result.addOutcome(tally())
            next()
        }

        report()
    }

    /** Advance to next dice pool state */
    override fun next() {
        end = pool.next()
    }
}