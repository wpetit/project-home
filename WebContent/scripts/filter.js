environmentAppFilters.filter('jenkinsStatusColorFilter', function() {
	return function(status) {
		var color = "";
		if (status == "SUCCESS") {
			color = "blue";
		} else if (status == "FAILURE") {
			color = "red";
		} else {
			color = "yellow";
		}
		return color;
	};
});

environmentAppFilters.filter('jenkinsJobColorFilter', function() {
	return function(color) {
		var jobColor = "";
		if (color.indexOf("anime") != -1 ) {
			jobColor = color + ".gif";
		} else {
			jobColor = color + ".png";
		}
		return jobColor;
	};
});

environmentAppFilters.filter('sonarViolationsChangeStatus', function() {
	return function(violations) {
		var violationChangeStatus = null;
		if (violations.number > violations.previousNumber) {
			violationChangeStatus = "sonarGreater.png";
		} else if (violations.number < violations.previousNumber) {
			violationChangeStatus = "sonarLower.png";
		} else {
			violationChangeStatus = "blank_10x10.png";
		}
		return violationChangeStatus;
	};
});

environmentAppFilters.filter('sonarViolationsChangeDiff', function() {
	return function(violations) {
		var violationChangeDiff = '(+0)';
		if (violations.number > violations.previousNumber) {
			violationChangeDiff = '(+'+Math.round((violations.number-violations.previousNumber)*100)/100+')';
		} else if (violations.number < violations.previousNumber) {
			violationChangeDiff = '('+Math.round((violations.number-violations.previousNumber)*100)/100+')';
		}
		return violationChangeDiff;
	};
});

environmentAppFilters.filter('sonarViolationsChangeStatusInverse', function() {
	return function(violations) {
		var violationChangeStatus = null;
		if (violations.number > violations.previousNumber) {
			violationChangeStatus = "sonarGreater_ok.png";
		} else if (violations.number < violations.previousNumber) {
			violationChangeStatus = "sonarLower_ko.png";
		} else {
			violationChangeStatus = "blank_10x10.png";
		}
		return violationChangeStatus;
	};
});