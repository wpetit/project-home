app.service('environmentService', function($http) {
	this.getAll = function() {
		return $http.get('resources/environment.json');
	};
	this.getJobInformation = function(jenkinsUrl,job) {
		return $http.get(jenkinsUrl+'job/'+job+'/api/json');
	};
	this.getBuildDetail = function(jenkinsUrl,build) {
		return $http.get(build.url.substring(build.url.indexOf('/jenkins')).replace('/jenkins',jenkinsUrl)+'/api/json'); 
	}
	this.getSonarResourcesAndAnalysisPeriod = function(sonarUrl) {
		return $http.get(sonarUrl+'api/resources?includetrends=true'); 
	}
	this.getSonarViolationsByResourceAndTime = function(sonarUrl,resourceKey,fromDate) {
		return $http.get(sonarUrl+'api/timemachine?resource='+resourceKey+'&fromDateTime='+fromDate+'&metrics=violations,blocker_violations,critical_violations,major_violations,minor_violations,info_violations,violations_density'); 
	}
});