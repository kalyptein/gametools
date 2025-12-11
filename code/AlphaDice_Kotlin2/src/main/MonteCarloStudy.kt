package main

abstract class MonteCarloStudy(name: String = "MonteCarloStudy", iter: Int): Study(name) {

    var iterations = iter

    override fun run() {

        init()
        next()      // initial randomization

        for (i: Int in 1..iterations) {
            loopInit()
            handleOutcome()          // refactor to work w/ multiple results
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