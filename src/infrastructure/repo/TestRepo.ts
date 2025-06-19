import { TestAggregate } from "../../domain/test-agg/TestAggregate";
import { RepoBase } from "./RepoBase";

export class TestRepo extends RepoBase<TestAggregate> {
	protected _save(agg: TestAggregate): Promise<void> {
		throw new Error("Method not implemented.");
	}
}