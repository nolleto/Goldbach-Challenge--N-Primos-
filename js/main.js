var app = angular.module('app', [])
	.controller('MainController', ['$timeout', function($timeout) {
		this.logs = [];
		this.maxNumber = 90000;
		this.iterations = 0;
		this.time = 0;
		this.timer;
		var _this = this;		

		this.startTimeout = function(func) {
			this.cancelTimeout();
			this.timer = $timeout(function() {
				_this.calculateTime(func);
			}, 1);
	    	this.timer.then(function() {
	        	_this.cancelTimeout();
	        });
		};

		this.cancelTimeout = function() {
			if (this.timer) {
				$timeout.cancel(this.timer);
				this.timer = undefined;
			}
		};

		this.executing = function() {
			return this.timer;
		};

		this.clear = function() {
			this.logs = [];
			this.iterations = 0;
			this.time = 0;
		}

		this.calculateTime = function(func) {
			var start = new Date().getTime();
			var obj = func.call(this);
			var end = new Date().getTime();
			this.time = end - start;
			obj.time = this.time;
			this.logs.unshift(obj);
		};

		this.test = function(argument) {
			this.maxNumber = 100;
			var i = 0;
			while (i++ < 500) {
				this.doIt();
				this.maxNumber += 100;
			}
		};

		this.doIt = function() {
			var maxN = this.maxNumber;
			this.calculateTime(function() {
				var primos = obterNumerosPrimos(maxN),
					dict = {},
					primoMax = Math.ceil(maxN / 2),
					highest = {},
					primoA,
					primoB,
					value;

				//Start magic 
				_this.iterations = 0
				for (var i = 0; primoMax >= primos[i]; i++) {
					primoA = primos[i];
					for (var j = i; j < primos.length; j++) {
						primoB = primos[j];
						value = primoA + primoB;
						_this.iterations++;
						if (value > maxN) {
							break;					
						} else if (!dict[value]) {
							dict[value] = 0;
						}
						dict[value]++;
					}
				}

				highest = getHighest(dict);
				return creatObj(maxN + ' (Normal)', highest.n, highest.o, _this.iterations, maxN);
			});
		};

		this.doItBetter = function() {
			var maxN = this.maxNumber;
			this.calculateTime(function() {
				var primos = obterNumerosPrimos(maxN),
					dict = {},
					primoMax = Math.ceil(maxN / 2),
					highest = {},
					primoA,
					primoB = primos[primos.length - 1],
					value,
					middleIndex = primos.length - 1,
					predict = Math.floor(maxN * .7);

				//Start magic 
				_this.iterations = 0
				for (var i = 0; i < primos.length; i++) {
					if (primos[i] > primoMax) {
						middleIndex = i;
						break;
					}
				};
				for (var i = 0; i < middleIndex; i++) {
					primoA = primos[i];
					while (primoA + primoB > maxN) {
						_this.iterations++;
						primos.pop();
						primoB = primos[primos.length - 1]						
					}

					for (var j = middleIndex - 1; j < primos.length; j++) {
						_this.iterations++;
						primoB = primos[j];						
						value = primoA + primoB;												
						if (!dict[value]) {
							dict[value] = 0;
						}
						dict[value]++;
					}
				}

				highest = getHighest(dict);
				return creatObj(maxN + ' (Better)', highest.n, highest.o, _this.iterations, maxN);
			});

			
		};

	}]);


function getHighest(dict) {
	var highestN,
		highestO;
	for (var i in dict) {
		if (!highestO || dict[i] >= highestO) {
			highestO = dict[i];
			highestN = i;
		}
	}
	return {
		n: highestN,
		o: highestO
	};
}

function creatObj(label, number, occurrences, iterations, numberUsed) {
	return {
		number: number,
		occurrences: occurrences,
		label: label,
		iterations: iterations,
		numberUsed: numberUsed
	}
}

function obterNumerosPrimos(nMax) {
	var j,
		k;
	var primos = [];
    for ( var i=0; i<nMax; i++ ) {
    	primos[i] = i+1;
    }
    
    for ( var i=1; i<nMax/2; i++ ) {
    	if ( primos[i] != 0 ) {
    		j = primos[i];
    		k = j;
    		while ( k <= nMax ) {
    			k += j;
    			if ( k <= nMax ) {
	    			primos[ k-1 ] = 0;
    			}
    		}
    	}
    }
    
    var soprimos = [];    
    for ( var i = 1; i< nMax ; i++ ) {
    	if ( primos[i] > 0 ) {
    		soprimos.push(primos[i]);    		
    	}
    }

    return soprimos;
}
