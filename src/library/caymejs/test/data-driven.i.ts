export interface DataDriven<TIn, TOut> {
	input: TIn;
	expected: TOut;
	name?: string;
}