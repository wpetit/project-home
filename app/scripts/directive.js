"use strict";

app.directive('displayEnv', function() {
	return {
		restrict: 'E',
	    scope: {
	        env: '=env'
	    },
		templateUrl: 'views/env-template.html'
	};
});

app.directive('displayJob', function() {
	return {
		restrict: 'E',
	    scope: {
	        job: '=job',
	        expand: '@'
	    },
		templateUrl: 'views/build-template.html'
	};
});

app.directive('displaySonar', function() {
	return {
		restrict: 'E',
	    scope: {
	        project: '=project',
	        sonarUrl: '=sonarUrl',
	        expand: '@'
	    },
		templateUrl: 'views/sonar-template.html'
	};
});