import axios from "axios";
import { UserCore } from "./schema";

type UserResponse = {
	id: string;
	email: string;
	role: string;
	username: string;
	metadata?: {
		fullname?: string;
		company?: string;
		country?: string;
		jobTitle?: string;
		avatarPath?: string;
	};
}

const bulbasaurApi = axios.create({
	baseURL: "https://skillsharp-api.icu/bulbasaur",
	headers: {
		"Content-Type": "application/json",
		"Accept": "application/json",
	},
});

export class UserProxy {
	static async getUser(id: string): Promise<UserCore | null> {
		const res = await bulbasaurApi.post(
			`/list`,
			{
				userIds: [id],
			}
		);
		const user = res.data.users[0] as UserResponse;
		if (!user) {
			return null;
		}
		return {
			id: user.id,
			name: user.username,
			avatar: user.metadata?.avatarPath || undefined,
		};
	}

	static async getUsers(ids: string[]): Promise<UserCore[]> {
		const res = await bulbasaurApi.post(
			`/list`,
			{
				userIds: ids,
			}
		);
		const users = res.data.users as UserResponse[];
		return users.map(user => ({
			id: user.id,
			name: user.username,
			avatar: user.metadata?.avatarPath || undefined,
		}));
	}
}