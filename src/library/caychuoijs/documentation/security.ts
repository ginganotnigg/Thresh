import { ParameterLocation, SecuritySchemeType } from "openapi3-ts/oas30";

export type SecurityScheme = {
	type: SecuritySchemeType;
	name: string;
	locationName: string;
	in: ParameterLocation;
	description?: string;
}

export abstract class ChuoiSecurityBase<
	TScheme extends string
> {
	constructor(
		private readonly securitySchemes: Record<TScheme, SecurityScheme>
	) { }

	getSecurityScheme(key: TScheme): SecurityScheme | undefined {
		return this.securitySchemes[key];
	}

	getSecuritySchemes(): SecurityScheme[] {
		return Object.values(this.securitySchemes);
	}
}
