import { jwtVerify, SignJWT } from 'jose';
import { st4xx } from './responseCode';
import { NextResponse } from 'next/server';

const secret_key = new TextEncoder().encode(process.env.JWT_SECRET);

/**
 * @param {import("next/server").NextRequest} req
 * @returns {Promise<object> | null}
 */
export async function getUserFromRequest(req) {
    const auth = req.headers.get('authorization')
    if (!auth) return null

    const token = auth.replace('Bearer ', '')

  try {
    const { payload } = await jwtVerify(
      token,
      secret_key
    )

    return payload   // { id, role, .., ..}
  } catch (e){
    console.log(`error getuserpayload ${e}`);
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
 * @param {object} params 
 * @returns {Promise<string>}
 */
export async function getToken(params) {
    
    if(!(params.id && params.role))
      throw new Error(`params invalid ${params}`);
      
    return await new SignJWT(
      {
        id:params.id,
        role:params.role
      }
    )
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime("1 h")
      .sign(secret_key);
    
}