"use strict";

app.directive('displayEnv', function() {
	return {
		restrict: 'E',
	    scope: {
	        env: '=env'
	    },
		templateUrl: 'templates/env-template.html'
	};
});

app.directive('displayJob', function() {
	return {
		restrict: 'E',
	    scope: {
	        job: '=job',
	        expand: '@'
	    },
		templateUrl: 'templates/build-template.html'
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
		templateUrl: 'templates/sonar-template.html'
	};
});