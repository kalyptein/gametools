package main

import kotlin.random.Random

abstract class DeterministicStudy : Study() {

    override fun run() {

        results["result"] = Result()
        init()

        while (!end) {
            loopInit()
            results["result"]?.addOutcome(tally())      // refactor to work w/ multiple results
            next()
        }

        report()
    }

    /** Advance to next dice pool state */
    override fun next() {
        end = pool.next()
    }
}