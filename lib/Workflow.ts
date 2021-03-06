/// <reference path="imports.d.ts" />

import AWS = require("aws-sdk");
import a = require("./Activity");
import d = require("./Decider");
import e = require("./EventParser");
import dal = require("./SwfDataAccess");
import r = require("./ActivityRegister");
import w = require("./WorkflowItemRegister");
import interfaces = require("./Interfaces");
import uuid = require("uuid");
import errors = require("./CustomErrors");

export class WorkflowClient {

  private config;
  private workflow: interfaces.IOptions;
  private swf: dal.ISwfDataAccess;

  constructor(workflow: interfaces.IOptions, awsConfig: any, swf?: dal.ISwfDataAccess) {
    
    this.validateOptions(workflow);
    this.validateConfig(awsConfig);

    this.config = awsConfig;

    AWS.config.update(this.config);

    this.workflow = workflow;

    if (swf == null)
      this.swf = new dal.SwfDataAccess();
    else
      this.swf = swf;

  }

  validateOptions(workflow: interfaces.IOptions) {
    if (workflow == null) throw new errors.NullArgumentError("workflow");
    if (workflow.domain == null) throw new errors.InvalidArgumentError("domain is mandatory");
    if (workflow.taskList == null) throw new errors.InvalidArgumentError("taskList is mandatory");
  }

  validateConfig(awsConfig: any) {

    if (awsConfig == null) throw new errors.NullArgumentError("awsConfig");
    if (awsConfig.accessKeyId == null) throw new errors.InvalidArgumentError("accessKeyId is mandatory");
    if (awsConfig.secretAccessKey == null) throw new errors.InvalidArgumentError("secretAccessKey is mandatory");
    if (awsConfig.region == null) throw new errors.InvalidArgumentError("region is mandatory");
  }

  createActivityHost(taskList: string): a.ActivityHost {

    if (taskList == null || taskList == "") throw new errors.NullArgumentError("taskList cannot be null or empty");

    var reg = new r.ActivityRegister(this.workflow);
    var host = new a.ActivityHost(reg, this.workflow.domain, taskList, this.swf);

    return host;
  }

  createDeciderHost(taskList: string): d.DecisionHost {

    if (taskList == null || taskList == "") throw new errors.NullArgumentError("taskList cannot be null of empty");

    var eventParser = new e.EventParser();
    var reg = new r.ActivityRegister(this.workflow);
    var wiRegister = new w.WorkflowItemRegister();

    var host = new d.DecisionHost(wiRegister, reg, this.workflow.domain, taskList, this.swf, eventParser);

    return host;

  }

  startWorkflowOld(reference: string, input: string, callback: (err) => void) {

    if (reference == null || reference == "") throw new errors.NullArgumentError("reference is mandatory");

    input = input == null ? input = "" : input;

    var request: AWS.Swf.StartWorkflowExecutionRequest = {
      domain: this.workflow.domain,
      workflowId: uuid.v4(),
      input: input,

      workflowType: {
        name: this.workflow.workflowType,
        version: this.workflow.workflowTypeVersion
      },

      taskList: { name: this.workflow.taskList }

    };

    var me = this;

    this.swf.startWorkflowExecution(request, callback);

  }

  startWorkflow(name: string, version:string, input: string, callback: (err) => void) {

    if (name == null || name == "") throw new errors.NullArgumentError("name is mandatory");
    if (version == null || version == "") throw new errors.NullArgumentError("version is mandatory");
    
    input = input == null ? input = "" : input;

    var request: AWS.Swf.StartWorkflowExecutionRequest = {
      domain: this.workflow.domain,
      workflowId: uuid.v4(),
      input: input,

      workflowType: {
        name: name,
        version: version
      },

      taskList: { name: this.workflow.taskList }

    };

    var me = this;

    this.swf.startWorkflowExecution(request, callback);

  }
}

