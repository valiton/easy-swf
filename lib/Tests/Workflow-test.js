///<reference path="../imports.d.ts"/>
var workflow = require("../Workflow");

var errors = require("../CustomErrors");

//import acts = require("../Activity");
//import wrapper = require("../FunctionWrapper");
var gently = new (require("gently"));

var testGroup = {
    setUp: function (callback) {
        callback();
    },
    tearDown: function (callback) {
        callback();
    },
    "Can create a Decider Host": function (test) {
        var name = "taskList";
        var client = CreateClient();

        var dec = client.createDeciderHost(name);

        test.notEqual(dec, null, "nothing returned");
        test.equal(dec.taskList, name, "taskList not set");

        test.done();
    },
    "Cannot create an Activity Host with a valid task List": function (test) {
        var client = CreateClient();

        try  {
            var act1 = client.createActivityHost(null);
            test.equal(1, 0, "taskList cannot be null");
        } catch (e) {
            test.equal(e.name, new errors.NullArgumentError().name, "Wrong error returned");
        }

        try  {
            var act2 = client.createActivityHost("");
            test.equal(1, 0, "taskList cannot be an empty string");
        } catch (e) {
            test.equal(e.name, new errors.NullArgumentError().name, "Wrong error returned");
        }

        test.done();
    },
    "Cannot create a Decider Host with a valid task List": function (test) {
        var client = CreateClient();

        try  {
            var dec1 = client.createDeciderHost(null);
            test.equal(1, 0, "taskList cannot be null");
        } catch (e) {
            test.equal(e.name, new errors.NullArgumentError().name, "Wrong error returned");
        }

        try  {
            var dec2 = client.createDeciderHost("");
            test.equal(1, 0, "taskList cannot be empty string");
        } catch (e) {
            test.equal(e.name, new errors.NullArgumentError().name, "Wrong error returned");
        }
        test.done();
    },
    "Can start a workflow that exists in config": function (test) {
        var name = "workflowName";
        var version = "1";

        var options = {
            "domain": "myDomain",
            "taskList": "mainList"
        };

        var swf = gently.stub("Interfaces", "ISwfDataAccess");

        var config = {
            "accessKeyId": "access",
            "secretAccessKey": "secret",
            "region": "eu-west-1"
        };

        var client = new workflow.WorkflowClient(options, config, swf);

        gently.expect(swf, "startWorkflowExecution", function (request, callback) {
            test.notEqual(request.workflowId.length, 0, "uuid not set");
            test.equal(request.workflowType.name, name, "name not set");
            test.equal(request.workflowType.version, version, "version not set");
            test.equal(request.domain, options.domain, "domain not set");
        });

        client.startWorkflow(name, version, null, function (err) {
        });

        test.done();
    },
    "Null or Bad workflow definition throws an error": function (test) {
        var name = "workflowName";

        var swf = gently.stub("Interfaces", "ISwfDataAccess");

        var config = {
            "accessKeyId": "access",
            "secretAccessKey": "secret",
            "region": "eu-west-1"
        };

        var options = {
            "domain": "myDomain",
            "reference": "ref",
            "workflowType": name,
            "workflowTypeVersion": "1",
            "taskList": "mainList",
            "activities": null
        };

        ConstructorTest(test, null, config, swf, new errors.NullArgumentError("msg"));

        options.domain = null;
        ConstructorTest(test, options, config, swf);

        options.domain = "myDomain";

        options.taskList = null;
        ConstructorTest(test, options, config, swf);

        test.done();
    },
    "Null data layer does not throw an error": function (test) {
        var name = "workflowName";
        var options = {
            "domain": "myDomain",
            "reference": "ref",
            "workflowType": name,
            "workflowTypeVersion": "1",
            "taskList": "mainList",
            "activities": null
        };

        var swf = null;

        var config = {
            "accessKeyId": "access",
            "secretAccessKey": "secret",
            "region": "eu-west-1"
        };

        var client = new workflow.WorkflowClient(options, config, swf);

        test.done();
    },
    "Null or Bad AWS config name throws an error": function (test) {
        var name = "workflowName";
        var options = {
            "domain": "myDomain",
            "taskList": "mainList"
        };

        var swf = gently.stub("Interfaces", "ISwfDataAccess");

        var config = {
            "accessKeyId": "access",
            "secretAccessKey": "secret",
            "region": "eu-west-1"
        };

        ConstructorTest(test, options, null, swf, new errors.NullArgumentError("msg"));

        test.done();
    }
};

function ConstructorTest(test, options, config, swf, errorType) {
    if (errorType == null)
        errorType = new errors.InvalidArgumentError("msg");

    try  {
        var client = new workflow.WorkflowClient(options, config, swf);
        test.equal(1, 0, "an error should have occurred");
    } catch (e) {
        test.equal(e.name, errorType.name, "received wrong error: " + e.name + ":" + e.message);
    }
}

function CreateClient() {
    var options = {
        "domain": "myDomain",
        "reference": "ref",
        "workflowType": "myName",
        "workflowTypeVersion": "1",
        "taskList": "mainList",
        "activities": []
    };

    var swf = gently.stub("Interfaces", "ISwfDataAccess");

    var config = {
        "accessKeyId": "access",
        "secretAccessKey": "secret",
        "region": "eu-west-1"
    };

    return new workflow.WorkflowClient(options, config, swf);
}

exports.workflowTests = testGroup;
//# sourceMappingURL=Workflow-test.js.map
