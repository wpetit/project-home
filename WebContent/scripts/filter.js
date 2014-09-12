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

environmentAppFilters.filter('sonarViolationsChangeStatusInverse', function() {
	return function(violations) {
		var violationChangeStatus = null;
		if (violations.number < violations.previousNumber) {
			violationChangeStatus = "sonarGreater_ok.png";
		} else if (violations.number > violations.previousNumber) {
			violationChangeStatus = "sonarLower_ko.png";
		} else {
			violationChangeStatus = "blank_10x10.png";
		}
		return violationChangeStatus;
	};
});