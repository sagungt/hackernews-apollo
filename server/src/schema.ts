import { makeSchema } from 'nexus';
import { join } from 'path';
import * as types from './graphql';

export default makeSchema({
  types,
  outputs: {
    schema: join(process.cwd(), 'schema.graphql'),
    typegen: join(process.cwd(), 'nexus-typegen.ts'),
  },
  contextType: {
    module: join(process.cwd(), './src/context.ts'),
    export: 'Context',
  },
});
