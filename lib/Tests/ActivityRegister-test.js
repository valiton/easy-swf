///<reference path="../imports.d.ts"/>
var reg = require("../ActivityRegister");
var help = require("../Helpers/TestHelper");

var act1 = {
    reference: "ProcessRssFeed",
    name: "ProcessRssFeed",
    version: "1",
    taskList: "mainList"
};

var act2 = {
    reference: "CreateFinalFeed",
    name: "CreateFinalFeed",
    version: "2",
    taskList: "mainList"
};

var workflow = {
    domain: "BuildTailoredRssFeed",
    reference: "BasicRssFeed",
    workflowType: "BasicRssFeed",
    workflowTypeVersion: "1",
    taskList: "mainList",
    activities: [act1, act2]
};

var testGroup = {
    setUp: function (callback) {
        callback();
    },
    tearDown: function (callback) {
        callback();
    },
    "Can create an Activity Register": function (test) {
        var ar = new reg.ActivityRegister(workflow);

        test.notEqual(ar, null, "an object should have been created");
        test.done();
    },
    "Throws an error when no workflow is provided": function (test) {
        help.nullErrorTest(test, function () {
            var ar = new reg.ActivityRegister(null);
        });

        test.done();
    },
    "Can get an ActivityDescriptor by ref": function (test) {
        var ar = new reg.ActivityRegister(workflow);

        var activity = ar.getActivityDescriptorByRef("ProcessRssFeed");

        test.equal(activity.name, workflow.activities[0].name);

        test.done();
    },
    "Can get an ActivityDescriptor by name and version": function (test) {
        var ar = new reg.ActivityRegister(workflow);

        var activity = ar.getActivityDescriptor("ProcessRssFeed", "1");

        test.equal(activity.name, workflow.activities[0].name);

        test.done();
    },
    "Can get an Activity by ref": function (test) {
        var ar = new reg.ActivityRegister(workflow);

        var activity = ar.getActivityByRef("ProcessRssFeed");

        test.equal(activity.name, workflow.activities[0].name);

        test.done();
    },
    "Throws error on bad request for ActivityDescriptor by ref": function (test) {
        var ar = new reg.ActivityRegister(workflow);

        help.invalidArgumentErrorTest(test, function () {
            ar.getActivityDescriptorByRef("fakdj");
        });

        test.done();
    },
    "Throws error on bad request for ActivityDescriptor by name and version": function (test) {
        var ar = new reg.ActivityRegister(workflow);

        help.invalidArgumentErrorTest(test, function () {
            ar.getActivityDescriptor("fadkj", "1");
        });

        test.done();
    },
    "Throws error on bad request for Activity by ref": function (test) {
        var ar = new reg.ActivityRegister(workflow);

        help.invalidArgumentErrorTest(test, function () {
            ar.getActivityByRef("dfaskj");
        });

        test.done();
    }
};

//function errorTrap(test: nodeunit.Test, fnc: () => void, err: Error);
//function errorTrap(test: nodeunit.Test, fnc: () => void) {
//  var errorType = new errors.InvalidArgumentError();
//  try {
//    fnc();
//    test.equal(1, 0, "an error should have occurred");
//  } catch (e) {
//    test.equal(e.name, errorType.name, "received wrong error: " + e.name + ":" + e.message);
//  }
//}
exports.activityRegisterTests = testGroup;
//# sourceMappingURL=ActivityRegister-test.js.map