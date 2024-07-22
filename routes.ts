/**
 * An array of routes that accessible to the public
 * These routes do not required authentication
 * @type {string[]}
 */
export const publicRoutes: string[] = ["/"];

/**
 * An array of routes thats uses for authentication
 * These routes will redirect user to /settings
 * @type {string[]}
 */
export const authRoutes: string[] = ["/auth/login", "/auth/register"];

/**
 * The prefix of API route for authentication
 * @type {string}
 */
export const apiAuthPrefix: string = "/api/auth";

export const DEFAULT_LOGIN_REDIRECT = "/settings";
