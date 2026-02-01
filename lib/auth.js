import { jwtVerify, SignJWT } from 'jose';
import { st4xx } from './responseCode';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const secret_key = new TextEncoder().encode(process.env.JWT_SECRET);
export const cookie_name = "authorization";
/**
 * @param {import("next/server").NextRequest} req
 * @returns {Promise<import("jose").JWTPayload> | null}
 */
export async function getUserFromRequest(req) {
  const token = req?.cookies?.get(cookie_name).value ?? req.headers.get("Bearer")?.split(' ')[1];
  if (!token) return null;
  return await getPayload(token);
}

/**
 * @returns {Promise<import("jose").JWTPayload> | null}
 */
export async function getUserFromCookie() {
  const token = (await cookies()).get(cookie_name)?.value;
  if(!token) return null;
  return await getPayload(token);
}

/**
 * @param {string} token 
 * @returns {Promise<import("jose").JWTPayload | null>}
 */
async function getPayload(token){
  try {
    const { payload } = await jwtVerify(
      token,
      secret_key
    )

    return payload   // { id, role, .., ..}
  } catch (e){
    if(process.env.NODE_ENV === "development")
      console.error(`error getuserpayload ${e}`);
    return null
  }
}


class AuthError extends Error{
  constructor(code,message){
    super(message);
    this.code = code;
    this.name = "Auth Error";
  }
}

/**
 * @type {Map<string, [string,number]>}
 */
const cause = (function(){
  const x = globalThis.causeAuthErr ?? new Map(
    [
      ["n0uth",["UNAUTHENTICATED",st4xx.unauthorized]],
      ["n0fbd",["FORBIDDEN",st4xx.forbidden]]
    ]
  )

  if(process.env.NODE_ENV === "development" && globalThis.causeAuthErr == null)
    globalThis.causeAuthErr = x;

  return x;
})();


/**
 * @param {object} user 
 * @param {Array<string>} roles 
 */
export function requireRole(user, roles) {

  if (!user) {
    const code = "n0uth";
    const reason = cause.get(code)[0];

    throw new AuthError(code,reason);
  }

  if (!roles.includes(user.role)) {
    const code = "n0fbd";
    const reason = cause.get(code)[0];
    
    throw new AuthError(code,reason);
  }
}

/**
 * @param {Error} err 
 * @returns {NextResponse | null}
 */
export function authError(err){
  if (err instanceof AuthError && cause.has(err.code)){
    const [reason,code] = cause.get(err.code);
    return NextResponse.json({data:reason},{status:code});
  }

  return null
}


/**
 * @param {{id:string, role:string}} params 
 * @param {number} hour
 * @returns {Promise<{token:string, maxAge:number}>}
 */
export async function getToken(params,hour=1) {
    
    if(!(params.id && params.role))
      throw new Error(`params invalid ${params}`);
    
    hour = Math.max(1,Math.round(hour));

    const token = await new SignJWT(
      {
        id:params.id,
        role:params.role
      }
    ).setProtectedHeader({ alg: 'HS256' }).setIssuedAt().setExpirationTime(`${hour} hr`).sign(secret_key);
    
    return {
      token,
      maxAge: 60*60*hour
    };
}