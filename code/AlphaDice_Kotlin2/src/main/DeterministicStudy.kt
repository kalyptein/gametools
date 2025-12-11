package main

import kotlin.collections.set

abstract class DeterministicStudy(name: String = "DeterministicStudy") : Study(name) {

    override fun run() {

        init()

        while (!end) {
            loopInit()
            handleOutcome()          // refactor to work w/ multiple results
            next()
        }

        report()
    }

    /** Advance to next dice pool state */
    override fun next() {
        end = pool.next()
    }
}