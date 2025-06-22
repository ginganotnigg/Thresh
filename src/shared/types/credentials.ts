export const RolesAsConst = [
	"1",
	"2",
] as const;

export const RoleNamesAsConst = {
	"1": "MANAGER",
	"2": "CANDIDATE",
} as const;

export type Roles = (typeof RolesAsConst)[number];
export type RoleNames = (typeof RoleNamesAsConst)[keyof typeof RoleNamesAsConst];

export const ReverseRoleNames = Object.fromEntries(
	Object.entries(RoleNamesAsConst).map(([key, value]) => [value, key])
) as Record<RoleNames, Roles>;

export type CredentialsBase = {
	userId: string;
	role: RoleNames;
}