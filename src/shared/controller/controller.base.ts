export abstract class ControllerBase {
	abstract constructRouter(): Promise<void>;
}