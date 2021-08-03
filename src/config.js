export const database = {
  common: {
    connectionString: process.env.DATABASE_URL,
    query_timeout: 30000,
    connectionTimeoutMillis: 5000,
  },
  get pool(){return {
    ...this.common,
    max: 3,
    idleTimeoutMillis: 30000,
  }},
  get client(){return this.common},
}

/**
 * https://www.npmjs.com/package/express-session#options
 */
export const session_options = {
  secret: process.env.SECRET_SESSION, // Execute in bash "openssl rand -base64 30" to get a strong secret string
  resave: false,
  name: 'sessionId',
  cookie: {
    maxAge: 43200000, // 12 Hours
    httpOnly: true,
    sameSite: true // Strict
    //domain: "example.com",
  },
  proxy: true,
  rolling: true,  // Cookie's expiration time will be refreshed on each request
  saveUninitialized: false,
}

// Password hashing algorithm config
export const argon = {
  timeCost: 10
}
