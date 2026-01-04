import { neon } from '@neondatabase/serverless';

// Create neon client with no caching
const sql = neon(process.env.DATABASE_URL!, {
  fetchOptions: {
    cache: 'no-store',
  },
});

export { sql };

