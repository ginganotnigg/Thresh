import { Router } from 'express';
import { Namespace } from 'socket.io';
import CommandUsecase from './usecase/commands/command';
import WriteRepository from './infra/repository/write.repo';
import RetriverRepository from './infra/repository/retriver.repo';
import { Loader } from './loader';
import { eventDispatcherInstance } from '../../common/event/event-queue';
import { TestProcessEvaluatedEvent, TestProcessEvaluatedEventHandler } from './events/test-process-eveluated.event';


const writeRepo = new WriteRepository();
const retriverRepo = new RetriverRepository();

const command = new CommandUsecase(retriverRepo, writeRepo);
const query = new TestProcessQuery();

const loader = new Loader(retriverRepo, command);

async function moduleLoad(router: Router, namespace: Namespace) {
	await loader.loadInprogresses();
	restController(router, command, query);
	socketController(namespace, command, query);
	eventDispatcherInstance.register(TestProcessEvaluatedEvent, new TestProcessEvaluatedEventHandler(namespace));
	console.log('Test Process module loaded');
}

module.exports = moduleLoad;