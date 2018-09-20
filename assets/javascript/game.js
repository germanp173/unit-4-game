// GAME SPECS
// - Crystal Number Range: 1-12
// - Total Score Range: 19-120

var crystals = {
    red: {
        value: 0,
        multiplier: 0
    },
    blue: {
        value: 0,
        multiplier: 0
    },
    purple: {
        value: 0,
        multiplier: 0
    },
    orange: {
        value: 0,
        multiplier: 0
    }
}

var crystalGame = {
    wins: 0,
    losses: 0,
    minCrystalNumber: 1,
    maxCrystalNumber: 12,
    minTotalScore: 19,
    maxTotalScore: 120,
    targetScore: 0,
    playerScore: 0,
    
    startGame: function(){
        this.playerScore = 0;
        this.setCrystalNumbers();
        var maxMultiplier = 12;
        this.generateGameAlgorithm(maxMultiplier);
        this.resetUI();
    },

    resetUI: function(){
        $("#target-score").text(this.targetScore);
        $("#player-score").text(this.playerScore);
    },

    getCrystalData: function(objProperty) {
        // Returns an array of all Crystal data of 
        // a given crystal object.
        var values = [];
        for (var gem in crystals){
            values.push(crystals[gem][objProperty]);
        }
        return values;
    },

    setCrystalNumbers: function(){
        // Generates a UNIQUE random number for each crystal.
        for (var gem in crystals){
            // Get the latest Crystal values.
            var currentCrystalValues = this.getCrystalData("value");

            // Set the Crystal value to a unique random number.
            crystals[gem].value = generateRandomUniqueNumber();
        }
        
        function generateRandomUniqueNumber(){
            // Generate a random number between the Crystal min and max.            
            var randomNum = Math.floor(Math.random() * crystalGame.maxCrystalNumber) + crystalGame.minCrystalNumber;

            // Return random number if it doesn't exist as a current crystal value (this mean its unique).
            if (!currentCrystalValues.includes(randomNum)){
                return randomNum;
            }
            
            // Recursive call to regenerate a unique number.
            return generateRandomUniqueNumber();
        }
    },

    generateGameAlgorithm: function(maxMultiplier){
        // Set random crystal multipliers.
        // Random number will be capped based on the given max multiplier.
        setCrystalMultipliers(maxMultiplier);

        // Get the total score based on the multiplers generated and the value of each gem.
        var totalScore = this.getTotalScore();

        // Verify that the total score falls within the acceptable range.
        if (totalScore >= this.minTotalScore && totalScore <= this.maxTotalScore){              
            this.targetScore = totalScore;
            return;
        }
        else if (totalScore > this.maxTotalScore){
            // If score is too high, lower the max multiplier.
            this.generateGameAlgorithm(--maxMultiplier);
        }
        else{
            // If score is too low, raise the max multiplier.            
            this.generateGameAlgorithm(++maxMultiplier);
        }
        
        function setCrystalMultipliers(maxMultiplier){
            // Generate random multipliers for each crystal (these don't need to be unique).
            for (var gem in crystals){
                crystals[gem].multiplier = Math.floor(Math.random() * maxMultiplier) + 1;
            }
        }
    },

    getTotalScore: function(){
        var sum = 0;
        for (var gem in crystals){
            var gemTotal = crystals[gem].value * crystals[gem].multiplier;
            sum += gemTotal;
        }
        return sum;
    },

    checkScore: function(crystal){
        // Update player score.
        this.playerScore += crystals[crystal].value;
        
        $("#player-score").text(this.playerScore);
        if (this.playerScore === this.targetScore){
            // Player won
            this.wins++;
            $("#result").text("YOU WON!");
            $("#wins").text(this.wins);
            this.startGame();
        }
        else if (this.playerScore > this.targetScore){
            // Player loss
            this.losses++;
            $("#result").text("YOU LOSS!");
            $("#losses").text(this.losses);
            this.startGame();
        }
    }
}

$(".crystal").on("click", function(crystal){
    var crystal = $(this).attr("data-value");
    crystalGame.checkScore(crystal);
})

crystalGame.startGame();