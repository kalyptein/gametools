package main

import studies.OutgunnedMonteCarloStudy
import studies.OutgunnedStudy
import studies.UnderclockStudy

fun main(args: Array<String>) {

    // Try adding program arguments via Run/Debug configuration.
    // Learn more about running applications: https://www.jetbrains.com/help/idea/running-applications.html.
//    println("Program arguments: ${args.joinToString()}")

//    UnderclockStudy(1000000).run()

//    OutgunnedMonteCarloStudy.multiRun()
    OutgunnedMonteCarloStudy(1000000, 2).run()
}