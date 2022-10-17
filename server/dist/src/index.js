"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_1 = require("apollo-server");
const schema_1 = __importDefault(require("./schema"));
const context_1 = require("./context");
const server = new apollo_server_1.ApolloServer({
    schema: schema_1.default,
    context: context_1.context,
});
const port = 3000;
server.listen({ port }).then(({ url }) => {
    // eslint-disable-next-line no-console
    console.log(`🚀 Server ready at ${url}`);
});
exports.default = server;
//# sourceMappingURL=index.js.map