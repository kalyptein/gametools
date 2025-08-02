package studies

import main.DeterministicStudy
import main.Die
import main.Outcome

// 0d = roll 2d, basic only on a 6-6 (1-in-36), on reroll failure, botch
// 1d = roll 2d, basic only on a 4-4, 5-5 or 6-6 (1-in-12), on reroll failure, botch

// successes
// basic = 1
// critical = 3
// extreme = 9
// impossible = 27
// jackpot = 81

// roll qualities
// single roll
// risky reroll
// free reroll
// all-in (must have some success to risk)
// grit loss if this is a gamble

fun main(args: Array<String>) {

    // Try adding program arguments via Run/Debug configuration.
    // Learn more about running applications: https://www.jetbrains.com/help/idea/running-applications.html.
//    println("Program arguments: ${args.joinToString()}")

//    UnderclockStudy(1000000).run()

    OneRollStudy.multiRun()
//    WotGStudy().run()
}

class OneRollStudy(var size: Int, var mod: Int = 0) : DeterministicStudy() {

    companion object {
        fun multiRun() {
            // rerun with dice pools from 0 to 9
            (2 until 10).forEach {
                OneRollStudy(it, 0).run()
            }
        }
    }

//    var difs = arrayOf( 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 )
    override var name = "One-Roll Engine Study (Deterministic) - ${size}d"

    override var outcomeComparator: Comparator<Outcome>? = Comparator { o1, o2 ->
        o1.name.toDouble().compareTo(o2.name.toDouble())
    }

    override fun init() {

//        var difs = arrayOf( 5, 10, 15, 18, 20, 25, 30, 35, 40, 45, 50 )
//        pool.dice.add(Die("die",10))
//        pool.dice.add(Die("die",10))
//        pool.dice.add(Die("die",10))
//        pool.dice.add(Die("die",10))
//
//        while (true) {
//            val sets = pool.getSets()
//            val set = sets.entries.first()
//            val total = (set.value * 10) + (if (set.key == 10) 0 else set.key)
//
//            var bestDif = 0
//            difs.forEach { dif -> if (dif <= total) bestDif = dif }
//
//            println ("${pool.toString()} = ${sets.toString()}  ->  $set  =  $total")
//
//            pool.roll()
//        }

        // TODO
        //
        // figure out the 50% DIF number for each size of dice pool; could use as a static equivalent
        // try w/ Outgunned-style reroll, free reroll, and all-in

        // build dicepool
        (0 until size).forEach {
            pool.dice.add(Die("die",6))
        }

//        difs.forEach { dif -> result.outcomes[dif.toString()] = Outcome(dif.toString()) }
    }

    override fun loopInit() {

    }

    override fun tally(): Outcome {

        val sets = pool.getSets().toSortedMap( compareByDescending<Int?> { it } )   // sort by height, not width
        val set = sets.entries.firstOrNull { it.value > 1 }
        var width = set?.value ?: 0
        var height = set?.key ?: 0

        if (width <= 1) {
            width = 0
            height = 0
        }

//        var bestDif = 0
//        difs.forEach { dif -> if (dif <= height) bestDif = dif }

        return Outcome("${(height)}")
    }

    override fun reportOutcome(oc: Outcome): String {
        return "${oc.name}\t${oc.count}\t${oc.fractionOfTotal * 100}"
    }
}