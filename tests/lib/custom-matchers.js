var jasmineCustomMatchers = {
	toBeGreaterThanOrEqualTo : function (util, customEqualityTesters) {
		return {
			compare : function (value, min) {
				var result = {
					pass : (value >= min)
				};
				
				if (result.pass) {
					result.message = value +  'was at least ' + min;
				} else {
					result.message = 'Expected ' + value + ' to be at least ' + min;
				}
				
				return result;
			}
		}
	},
	
	toBeLessThanOrEqualTo : function (util, customEqualityTesters) {
		return {
			compare : function (value, max) {
				var result = {
					pass : (value <= max)
				};
				
				if (result.pass) {
					result.message = value +  'was at no greater than ' + max;
				} else {
					result.message = 'Expected ' + value + ' to be no greater than ' + max;
				}
				
				return result;
			}
		}
	}
};
