var superProblems = 
[ // Array of rounds:  For each problem, number the operation in the order that they should be performed.  Do not solve.

    // BEGIN TRAINING
    
    
	// P->[E]-[M-D]-[A-S]
	//In the brackets, any order
	//
	[ // Round A (2 operations : + and - teach left-to-right, At this point, +/- can be done in any order 
		["5 + 3 - 2", "6 + 3 - 7", "1 + 8 - 3"], // Problem 0
		["1 0 + 4 - 8", "7 + 4 - 3" , "8 + 7 - 6"], // Problem 1
		["1 5 + 4 - 3", "1 3 + 8 - 9", "1 2 + 8 - 7"], // Problem 2
		["2 0 + 8 - 9", "1 8 + 4 - 7" , "1 9 + 6 - 9"] // Problem 3
	],
	[ // Round B (2 operations x and +/- teach left-to-right, At this point the //rule says do x before +/-
		["5 x 6 + 10", "4 x 8 + 4", "7 x 2 + 5"], // Problem 0
		["6 x 3 - 4", "2 x 7 - 9", "3 x 8 - 1 1"], // Problem 1
		["9 x 4 + 5", "8 x 6 + 15", "7 x 5 + 1 3"], // Problem 2
		["5 x 2 - 5", "4 x 4 - 4", "8 x 7 - 6"] // Problem 3
	],
	[ // Round C (2 operations ÷ and +/- teach left-to-right, At this point the //rule says do ÷ before +/-
		["6 ÷ 2 + 4", "10 ÷ 5 + 4", "15 ÷ 3 + 5"], // Problem 0
		["10 ÷ 2 - 5", "25 ÷ 5 - 5", "28 ÷ 4 - 7"], // Problem 1
		["30 ÷ 3 + 8", "42 ÷ 7 + 7", "54 ÷ 6 + 11"], // Problem 2
		["50 ÷ 5 - 7", "36 ÷ 6 - 3", "66 ÷ 11 - 2"] // Problem 3
	],
	[ // Round D (2 operations ÷/x and +/-: teach left-to-right as a strategy, //but if you know the rule, do yo thang, play boy!
		["30 - 5 x 5 + 4", "24 - 6 x 4 + 1", "36 - 4 x 4 + 15"], // Problem 0
		["42 + 6 x 2 - 6", "16 + 4 x 2 - 14", "19 + 2 x 8 - 2"], // Problem 1
		["32 - 3 x 8 + 7", "72 - 4 x 8 + 7", "54 - 2 x 7 + 17"], // Problem 2
		["56 + 6 x 6 - 16", "60 - 7 x 7 + 9", "40 - 4 x 9 + 4"] // Problem 3
	],
	[ // Round E (2 operations ÷/x and +/-: teach left-to-right as a strategy, //but if you know the rule, do yo thang, play boy!
		["20 - 30 ÷ 5 + 4", "10 - 24 ÷ 4 + 1", "16 - 36 ÷ 4 + 15"], // Problem 0
		["30 + 42 ÷ 2 - 6", "16 + 16 ÷ 2 - 14", "10 + 18 ÷ 3 - 2"], // Problem 1
		["12 - 32 ÷ 8 + 7", "24 - 72 ÷ 8 + 7", "22 - 56 ÷ 7 + 7"], // Problem 2
		["56 + 56 ÷ 8 - 16", "33 - 60 ÷ 6 + 9", "13 - 40 ÷ 10 + 5"] // Problem 3
	],
	[ // Round F (2 operations ÷/x and +/-: teach left-to-right as a strategy, //but if you know the rule, do yo thang, play boy!
		["20 x 2 - 18 ÷ 18", "10 x 6 - 24 ÷ 4", "3 x 11 - 6 ÷ 5"], // Problem 0
		["8 x 4 + 42 ÷ 2", "6 x 8 + 16 ÷ 2", "10 x 4 + 18 ÷ 2"], // Problem 1
		["4 x 3 - 32 ÷ 8", "24 x 72 ÷ 8", "22 x 56 ÷ 7"], // Problem 2
		["6 x 2 + 56 ÷ 8", "42 x 3 - 60 ÷ 6", "13 x 2 - 40 ÷ 10"] // Problem 3
	],
	[ // Round G (2 operations ÷/x and +/-: teach left-to-right as a strategy, //but if you know the rule, do yo thang, play boy!
		["30 ÷ 5 + 6 x 4", "24 ÷ 4 + 8 x 4", "36 ÷ 4 + 6 x 3"], // Problem 0
		["42 ÷ 2 - 2 x 6", "16 ÷ 2 - 3 x 3", "18 ÷ 3 - 3 x 2"], // Problem 1
		["32 ÷ 8 + 2 x 7", "72 ÷ 8 + 3 x 7", "56 ÷ 7 + 4 x 7"], // Problem 2
		["56 ÷ 8 - 2 x 4", "60 ÷ 3 - 2 x 9", "40 ÷ 10 + 6 x 5"] // Problem 3
	],	
	
	//END TRAINING PROBLEMS
	
	[ // Round 1 (2 operations)
		["1 + 2 x 6", "2 0 ÷ 5 + 4", "6 x 4 - 1 1"], // Problem 0
		["6 + 7 x 5 ", "4 5 ÷ 1 5 + 9", "8 x 4 ÷ 2"], // Problem 1
		["1 2 + 2 5 x 4", "7 ÷ 7 + 3 2", "4 3 - 8 - 1 0"], // Problem 2
		["6 1 - 1 9 ÷ 2", "2 1 + 1 0 x 5 0", "7 + 3 8 - 4"] // Problem 3
	],
	[ // Round 2 (3 operations)
		["2 0 ÷ 1 0 + 1 3 - 9", "1 3 x 4 + 3 - 2", "6 x 3 + 1 1 - 3"], // Problem 0
		["7 x 20 ÷ 2 - 1", "6 x 1 2 + 1 5 - 1 2", "7 - 2 0 ÷ 4 x 2"], // Problem 1
		["8 - 2 + 1 4 x 9", "1 8 + 8 x 8 ÷ 4", "1 5 x 1 9 - 1 2 ÷ 3"], // Problem 2
		["1 0 x 4 - 1 8 ÷ 3", "1 3 - 6 x 8 ÷ 2", "1 8 + 20 ÷ 4 - 1"] // Problem 3
	],
	[ // Round 3 (4 operations)
		["8 + 1 6 - 1 3 x 1 3 + 2", "1 8 + 1 5 x 1 7 x 5 - 3", "2 + 2 0 ÷ 2 + 2 x 1 6"], // Problem 0
		["1 5 - 1 4 + 5 x 1 5 ÷ 3", "9 x 1 8 ÷ 6 x 5 + 1 1", "1 5 ÷ 5 + 4 - 2 x 1 1"], // Problem 1
		["1 5 ÷ 5 - 3 x 1 2 + 4", "1 8 x 1 2 x 1 4 ÷ 2 + 9", "8 x 1 0 + 5 + 3 - 1"], // Problem 2
		["1 7 x 1 0 - 1 5 ÷ 3 x 1 0", "1 8 x 1 0 ÷ 2 - 1 + 4", "7 x 5 + 1 2 - 1 1 + 6"] // Problem 3
	],
	[ // Round 4 (2 operations)
		["1  6 ÷ 4 - 2", "2 +1 1 x 1 3", "4 + 1 2 - 1 6"], // Problem 0
		["1 6 ÷ 2 + 1 2", "1 5 ÷ 5 + 1 9", "1 3 + 2 x 1 8"], // Problem 1
		["5 x 1 5 ÷ 5", "5 + 5 + 1 3", "1 6 - 1 8 ÷ 9"], // Problem 2
		["9 x 9 + 6", "15 ÷ 3 x 1 4", "1 4 - 1 + 6"] // Problem 3
	],
	[ // Round 5 (3 operations)
		["1 9 - 1 3 x 2 0 ÷ 1 0", "2 - 1 x 1 9 + 1 0", "1 5 x 5 + 4 - 2"], // Problem 0
		["1 6 ÷ 2 x 3 - 2", "3 2 + 1 2 ÷ 2 x 5", "1 8 ÷ 2 + 1 0 - 2"], // Problem 1
		["1 4 - 6 x 9 + 1 2", "1 2 ÷ 4 x 7 - 3", "9 x 1 3 - 5 + 6"], // Problem 2
		["2 - 1 0 ÷ 5 x 1 5", "1 6 ÷ 2 - 2 x 1 4", "1 4 + 8 x 8 ÷ 4"] // Problem 3
	],
	[ // Round 6 (4 operations)
		["1 8 - 1 6 x 1 9 + 1 3 + 6", "1 4 ÷ 7 + 1 7 - 1 2 x 4", "1 6 - 1 5 ÷ 5 x 9 x 1 7"], // Problem 0
		["7 x 8 - 1 6 ÷ 8 + 1 4", "1 6 x 2 4 ÷ 2 + 1 0 + 9", "2 - 1 0 ÷ 5 + 5 x 5"], // Problem 1
		["9 + 1 5 x 5 - 4 + 1 6", "1 8 - 1 6 ÷ 4 x 3 x 1 4", "1 8 ÷ 3 x 1 4 + 1 8 - 4"], // Problem 2
		["1 4 + 1 8 x 1 9 - 1 0 ÷ 2", "1 0 ÷ 2 - 1 x 1 8 + 1 2", "1 4 + 1 8 ÷ 3 x 1 8 x 3"] // Problem 3
	],
	[ // Round 7 (2 operations)
		["1 2 ÷ 2 + 8", "8 + 2 x 1 6", "1 7 x 5 + 4"], // Problem 0
		["4 + 7 - 3", "3 + 1 5 + 9", "9 x 1 6 - 1 1"], // Problem 1
		["1 2 ÷ 6 + 1 1", "1 1 x 1 1 x 8", "1 6 ÷ 2 + 1 4"], // Problem 2
		["1 4 x 2 x 1 0", "1 5 x 1 5 + 1 2", "1 2 + 3 - 2"] // Problem 3
	],
	[ // Round 8 (3 operations)
		["1 6 + 2 4 ÷ 8 x 1 6", "1 6 + 2 x 1 0 ÷ 5", "5 - 2 x 1 5 ÷ 3"], // Problem 0
		["1 8 ÷ 9 + 1 8 x 4", "1 8 + 1 7 - 1 6 ÷ 8", "2 0 ÷ 4 + 9 x 1 5"], // Problem 1
		["1 4 ÷ 2 + 3 - 1", "1 6 - 2 x 1 2 + 7", "1 5 x 2 4 ÷ 3 - 1"], // Problem 2
		["7 x 1 6 - 1 8 ÷ 6", "8 + 4 - 2 4 ÷ 2", "1 7 + 1 3 x 2 4 ÷ 3"] // Problem 3
	],
	[ // Round 9 (4 operations)
		["6 x 2 4 ÷ 2 - 1 + 1 7", "8 ÷ 2 + 1 6 x 1 3 + 1 7", "1 0 x 1 5 + 7 x 8 + 1 9"], // Problem 0
		["1 9 + 2 x 1 0 + 1 5 ÷ 3", "1 0 x 8 + 2 + 1 0 - 9", "2 x 6 + 1 8 + 6 x 3"], // Problem 1
		["1 1 + 6 + 1 3 x 6 - 1", "1 1 + 7 x 1 2 ÷ 6 + 5", "1 6 - 1 6 x 1 2 ÷ 2 x 1 4"], // Problem 2
		["1 2 ÷ 2 + 6 + 3 - 3", "7 + 1 9 + 1 7 x 2 0 ÷ 5", "1 9 + 2 0 ÷ 4 x 4 - 2"] // Problem 3
	],
	[ // Round 10 (2 operations)
		["5 x 1 0 + 1 9", "1 9 - 8 ÷ 4", "2 x 1 2 + 4"], // Problem 0
		["4 - 1 6 ÷ 8", "1 0 ÷ 2 x 7", "7 x 1 9 + 1 0"], // Problem 1
		["1 3 - 1 6 ÷ 4", "4 x 1 4 + 1 3", "1 0 - 1 8 ÷ 2"], // Problem 2
		["1 8 ÷ 3 + 3", "1 2 ÷ 3 x 4", "1 6 ÷ 4 + 6"] // Problem 3
	],	
	[ // Round 11 (3 operations)
		["5 x 15 - 16 ÷ 4", "8 ÷ 4 + 18 x 2", "2 + 4 x 18 - 10"], // Problem 0
		["6 + 11 x 15 - 7", "10 ÷ 5 - 5 + 15", "2 + 10 x 15 ÷ 3"], // Problem 1
		["9 x 14 - 12 ÷ 4", "18 + 15 x 15 ÷ 3", "9 x 13 +13 - 3"], // Problem 2
		["4 - 10 ÷ 2 x 9", "11 + 11 x 15 ÷ 5", "17 +11 - 12 ÷ 2"] // Problem 3
	],
	[ // Round 12 (4 operations)
		["1 5 - 7 + 8 x 1 8 ÷ 3", "1 0 - 8 ÷ 2 + 9 x 1 5", "1 8 x 1 4 - 1 0 ÷ 5 + 1 4"], // Problem 0
		["1 7 - 2 + 8 x 5 x 1 8", "1 9 x 1 2 + 5 x 1 9 - 2", "4 - 4 + 1 6 ÷ 8 x 1 9"], // Problem 1
		["8 ÷ 4 - 1 + 5 + 7", "1 1 - 1 0 x 7 x 1 7 + 5", "1 7 + 2 0 ÷ 4 x 9 x 7"], // Problem 2
		["1 5 x 1 4 + 1 5 ÷ 5 + 6", "8 + 4 - 3 + 1 7 x 2", "5 x 1 9 - 1 1 + 1 9 x 9"] // Problem 3
	],
];

// superProblems.length // number of rounds
// superProblems[n].length // number of problems in round n
// superProblems[n][m].length // number of answers in problem m of round n
// superProblems[n][m][p]