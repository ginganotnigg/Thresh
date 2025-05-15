import { createClient } from "@connectrpc/connect";
import { createGrpcTransport } from "@connectrpc/connect-node";
import { Bulbasaur } from "./proto-gen/user/bulbasaur_pb";
import axios from "axios";
import { UserProxy } from "./domain/proxy/user.proxy";

async function main() {
	const transport = createGrpcTransport({
		baseUrl: "https://skillsharp-api.icu/bulbasaur.Bulbasaur/",

	});
	const client = createClient(Bulbasaur, transport);
	const result = await client.listUsers({
		userIds: [1n],
	})
	console.log(result);
}

async function main2() {
	const res = await UserProxy.getUsers(["1"]);
	console.log(res);
}

main2();