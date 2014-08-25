app.directive('displayEnv', function() {
	return {
		restrict: 'E',
	    scope: {
	        env: '=env'
	    },
		templateUrl: 'templates/env-template.html'
	}
});

app.directive('displayJob', function() {
	return {
		restrict: 'E',
	    scope: {
	        job: '=job'
	    },
		templateUrl: 'templates/build-template.html'
	}
});

app.directive('displaySonar', function() {
	return {
		restrict: 'E',
	    scope: {
	        project: '=project',
	        sonarUrl: '=sonarUrl'
	    },
		templateUrl: 'templates/sonar-template.html'
	}
});