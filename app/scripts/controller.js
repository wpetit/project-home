"use strict";

appControllers.controller('EnvironmentAppCtrl', function($scope, environmentService, $location, $modal) {
    $scope.getAll = function() {
	environmentService.getAll().success(function(data) {
	    $scope.applicationName = data.applicationName;
	    $scope.applicationLogo = data.applicationLogo;
	    $scope.applicationLinks = data.applicationLinks;
	    $scope.applicationTools = data.applicationTools;
	    $scope.envs = data.env;
	    $scope.jenkinsJobs = data.jenkinsJobs;
	    $scope.sonarResources = data.sonarResources;
	    $scope.sonarUrl = data.sonarUrl;
	    if (data.sonarDirectAccessUrl == null || data.sonarDirectAccessUrl === "") {
		$scope.sonarDirectAccessUrl = data.sonarUrl;
	    } else {
		$scope.sonarDirectAccessUrl = data.sonarDirectAccessUrl;
	    }
	    $scope.jenkinsUrl = data.jenkinsUrl;
	    $scope.jenkinsBase64UsrPwd = data.jenkinsBase64UsrPwd;
	    $scope.sonarPeriod = data.sonarPeriodForComparison;
	    $scope.sonarBase64UsrPwd = data.sonarBase64UsrPwd;
	    $scope.expandAllJenkins = data.expandAllJenkins;
	    $scope.expandAllSonar = data.expandAllSonar;
	    $scope.getJenkinsJobs();
	    $scope.getSonarViolations();
	}).error(function(data) {
	    $scope.globalError = "The project has not been customized. Please configure the environment.json file.";
	});
    };

    $scope.getJenkinsJobs = function() {
	for (var i = 0; i < $scope.jenkinsJobs.length; i++) {
	    $scope.getJenkinsJob($scope.jenkinsJobs[i]);
	}
    };

    $scope.getJenkinsJob = function(jenkinsJob) {
	environmentService.getJobInformation($scope.jenkinsUrl, jenkinsJob, $scope.jenkinsBase64UsrPwd).success(function(data) {
	    var job = data;
	    job.buildsDetails = [];
	    $scope.jobs.push(job);
	    $scope.getJenkinsBuilds(job);
	}).error(function(data, status) {
	    $scope.jenkinsStatus = "Jenkins is not available for the moment : Error " + status + ".";
	});
    };

    $scope.getJenkinsBuilds = function(job) {
	for (var i = 0; i < job.builds.length; i++) {
	    $scope.getJenkinsBuild(job, job.builds[i]);
	}
    };

    $scope.getJenkinsBuild = function(job, build) {
	environmentService.getBuildDetail($scope.jenkinsUrl, build, $scope.jenkinsBase64UsrPwd).success(function(data) {
	    job.buildsDetails.push(data);
	}).error(function(data, status) {
	    $scope.jenkinsStatus = "Jenkins is not available for the moment : Error " + status + ".";
	});
    };

    $scope.getSonarViolations = function() {
	environmentService.getSonarResourcesAndAnalysisPeriod($scope.sonarUrl, $scope.sonarBase64UsrPwd).success(function(data) {
	    $scope.sonarAnalysis = [];
	    for (var i = 0; i < data.length; i++) {
		if ($scope.sonarResources.length !== 0 && $scope.sonarResources.indexOf(data[i].key) !== -1) {
		    var perdiod = $scope.getResourceAnalysis(data[i].name, data[i].key, data[i].id, $scope.getPeriodDateTime(data[i]));
		}
	    }
	}).error(function(data, status) {
	    $scope.sonarStatus = "Sonar is not available for the moment : Error " + status + ".";
	});
    };

    $scope.getPeriodDateTime = function(resourcesData) {
	var periodDateTime = null;
	if ($scope.sonarPeriod === 1) {
	    periodDateTime = resourcesData.p1d;
	} else if ($scope.sonarPeriod === 2) {
	    periodDateTime = resourcesData.p2d;
	} else {
	    periodDateTime = resourcesData.p3d;
	}
	return periodDateTime;
    };

    $scope.getResourceAnalysis = function(resourceName, resourceKey, resourceId, fromDateTime) {
	environmentService.getSonarViolationsByResourceAndTime($scope.sonarUrl, resourceKey, fromDateTime, $scope.sonarBase64UsrPwd).success(function(dataByResource) {
	    if (fromDateTime != null) {
		var resourceAnalysis = {};
		resourceAnalysis.name = resourceName;
		resourceAnalysis.key = resourceKey;
		resourceAnalysis.id = resourceId;
		resourceAnalysis.violations = {};
		resourceAnalysis.violations.previousNumber = dataByResource[0].cells[0].v[$scope.arrayObjectIndexOf(dataByResource[0].cols,'violations','metric')];
		resourceAnalysis.violations.number = dataByResource[0].cells[dataByResource[0].cells.length - 1].v[$scope.arrayObjectIndexOf(dataByResource[0].cols,'violations','metric')];
		resourceAnalysis.blockerViolations = {};
		resourceAnalysis.blockerViolations.previousNumber = dataByResource[0].cells[0].v[$scope.arrayObjectIndexOf(dataByResource[0].cols,'blocker_violations','metric')];
		resourceAnalysis.blockerViolations.number = dataByResource[0].cells[dataByResource[0].cells.length - 1].v[$scope.arrayObjectIndexOf(dataByResource[0].cols,'blocker_violations','metric')];
		resourceAnalysis.criticalViolations = {};
		resourceAnalysis.criticalViolations.previousNumber = dataByResource[0].cells[0].v[$scope.arrayObjectIndexOf(dataByResource[0].cols,'critical_violations','metric')];
		resourceAnalysis.criticalViolations.number = dataByResource[0].cells[dataByResource[0].cells.length - 1].v[$scope.arrayObjectIndexOf(dataByResource[0].cols,'critical_violations','metric')];
		resourceAnalysis.majorViolations = {};
		resourceAnalysis.majorViolations.previousNumber = dataByResource[0].cells[0].v[$scope.arrayObjectIndexOf(dataByResource[0].cols,'major_violations','metric')];
		resourceAnalysis.majorViolations.number = dataByResource[0].cells[dataByResource[0].cells.length - 1].v[$scope.arrayObjectIndexOf(dataByResource[0].cols,'major_violations','metric')];
		resourceAnalysis.minorViolations = {};
		resourceAnalysis.minorViolations.previousNumber = dataByResource[0].cells[0].v[$scope.arrayObjectIndexOf(dataByResource[0].cols,'minor_violations','metric')];
		resourceAnalysis.minorViolations.number = dataByResource[0].cells[dataByResource[0].cells.length - 1].v[$scope.arrayObjectIndexOf(dataByResource[0].cols,'minor_violations','metric')];
		resourceAnalysis.infoViolations = {};
		resourceAnalysis.infoViolations.previousNumber = dataByResource[0].cells[0].v[$scope.arrayObjectIndexOf(dataByResource[0].cols,'info_violations','metric')];
		resourceAnalysis.infoViolations.number = dataByResource[0].cells[dataByResource[0].cells.length - 1].v[$scope.arrayObjectIndexOf(dataByResource[0].cols,'info_violations','metric')];
		resourceAnalysis.violationsDensity = {};
		resourceAnalysis.violationsDensity.previousNumber = dataByResource[0].cells[0].v[$scope.arrayObjectIndexOf(dataByResource[0].cols,'violations_density','metric')];
		resourceAnalysis.violationsDensity.number = dataByResource[0].cells[dataByResource[0].cells.length - 1].v[$scope.arrayObjectIndexOf(dataByResource[0].cols,'violations_density','metric')];
		resourceAnalysis.complexity = {};
		resourceAnalysis.complexity.previousNumber = dataByResource[0].cells[0].v[$scope.arrayObjectIndexOf(dataByResource[0].cols,'complexity','metric')];
		resourceAnalysis.complexity.number = dataByResource[0].cells[dataByResource[0].cells.length - 1].v[$scope.arrayObjectIndexOf(dataByResource[0].cols,'complexity','metric')];
		resourceAnalysis.classComplexity = {};
		resourceAnalysis.classComplexity.previousNumber = dataByResource[0].cells[0].v[$scope.arrayObjectIndexOf(dataByResource[0].cols,'class_complexity','metric')];
		resourceAnalysis.classComplexity.number = dataByResource[0].cells[dataByResource[0].cells.length - 1].v[$scope.arrayObjectIndexOf(dataByResource[0].cols,'class_complexity','metric')];
		resourceAnalysis.fileComplexity = {};
		resourceAnalysis.fileComplexity.previousNumber = dataByResource[0].cells[0].v[$scope.arrayObjectIndexOf(dataByResource[0].cols,'file_complexity','metric')];
		resourceAnalysis.fileComplexity.number = dataByResource[0].cells[dataByResource[0].cells.length - 1].v[$scope.arrayObjectIndexOf(dataByResource[0].cols,'file_complexity','metric')];
		resourceAnalysis.functionComplexity = {};
		resourceAnalysis.functionComplexity.previousNumber = dataByResource[0].cells[0].v[$scope.arrayObjectIndexOf(dataByResource[0].cols,'function_complexity','metric')];
		resourceAnalysis.functionComplexity.number = dataByResource[0].cells[dataByResource[0].cells.length - 1].v[$scope.arrayObjectIndexOf(dataByResource[0].cols,'function_complexity','metric')];
		resourceAnalysis.duplicatedBlocks = {};
		resourceAnalysis.duplicatedBlocks.previousNumber = dataByResource[0].cells[0].v[$scope.arrayObjectIndexOf(dataByResource[0].cols,'duplicated_blocks','metric')];
		resourceAnalysis.duplicatedBlocks.number = dataByResource[0].cells[dataByResource[0].cells.length - 1].v[$scope.arrayObjectIndexOf(dataByResource[0].cols,'duplicated_blocks','metric')];
		resourceAnalysis.duplicatedFiles = {};
		resourceAnalysis.duplicatedFiles.previousNumber = dataByResource[0].cells[0].v[$scope.arrayObjectIndexOf(dataByResource[0].cols,'duplicated_files','metric')];
		resourceAnalysis.duplicatedFiles.number = dataByResource[0].cells[dataByResource[0].cells.length - 1].v[$scope.arrayObjectIndexOf(dataByResource[0].cols,'duplicated_files','metric')];
		resourceAnalysis.duplicatedLines = {};
		resourceAnalysis.duplicatedLines.previousNumber = dataByResource[0].cells[0].v[$scope.arrayObjectIndexOf(dataByResource[0].cols,'duplicated_lines','metric')];
		resourceAnalysis.duplicatedLines.number = dataByResource[0].cells[dataByResource[0].cells.length - 1].v[$scope.arrayObjectIndexOf(dataByResource[0].cols,'duplicated_lines','metric')];
		resourceAnalysis.duplicatedLinesDensity = {};
		resourceAnalysis.duplicatedLinesDensity.previousNumber = dataByResource[0].cells[0].v[$scope.arrayObjectIndexOf(dataByResource[0].cols,'duplicated_lines_density','metric')];
		resourceAnalysis.duplicatedLinesDensity.number = dataByResource[0].cells[dataByResource[0].cells.length - 1].v[$scope.arrayObjectIndexOf(dataByResource[0].cols,'duplicated_lines_density','metric')];
		resourceAnalysis.coverage = {};
		resourceAnalysis.coverage.previousNumber = dataByResource[0].cells[0].v[$scope.arrayObjectIndexOf(dataByResource[0].cols,'coverage','metric')];
		resourceAnalysis.coverage.number = dataByResource[0].cells[dataByResource[0].cells.length - 1].v[$scope.arrayObjectIndexOf(dataByResource[0].cols,'coverage','metric')];
		resourceAnalysis.sqaleIndex = {};
		resourceAnalysis.sqaleIndex.previousNumber = dataByResource[0].cells[0].v[$scope.arrayObjectIndexOf(dataByResource[0].cols,'sqale_index','metric')];
		resourceAnalysis.sqaleIndex.number = dataByResource[0].cells[dataByResource[0].cells.length - 1].v[$scope.arrayObjectIndexOf(dataByResource[0].cols,'sqale_index','metric')];

		$scope.sonarAnalysis.push(resourceAnalysis);
	    }
	}).error(function(data, status) {
	    $scope.sonarStatus = "Sonar is not available for the moment : Error " + status + ".";
	});
    };

    $scope.getResourceAnalysisByKey = function(key) {
	for (var i = 0; i < $scope.sonarAnalysis.length; i++) {
	    if ($scope.sonarAnalysis[i].key === key) {
		return $scope.sonarAnalysis[i];
	    }
	}
    };

    $scope.arrayObjectIndexOf = function(myArray, searchTerm, property) {
	for (var i = 0, len = myArray.length; i < len; i++) {
	    if (myArray[i][property] === searchTerm) {
		return i;
	    }
	}
	return -1;
    };

    $scope.jenkinsStatus = null;
    $scope.sonarStatus = null;
    $scope.jobs = [];
    $scope.getAll();
});