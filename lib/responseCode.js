/** 
 * @file responseCode.js
 * @brief tujuan dari file ini adalah memudahkan pengertian dan penggunaan status code.
 * 
 * berisi objek dengan nama awalan dari status code, dengan field deskriptif yang akan digunakan pada proyek ini
 * st2xx
 * st4xx
 * st5xx
 *  */


 

/**
 * The request was successfully received, understood, and accepted
 */
export const st2xx = Object.freeze({
    /**
     * status code indicates that the request has succeeded. The content sent in a 200 response depends on the request method.
     */
    ok      : 200,

    /**
     * The 201 (Created) status code indicates that the request has been fulfilled and has resulted in one or more new resources being created.
     */
    created : 201,

    /**
     * status code indicates that the server has successfully fulfilled the request and that there is no additional content to send in the response content, 
     * response a statuscode onlwithout body
     */
    noContent : 204,

});

/**
 * The request contains bad syntax or cannot be fulfilled
 */
export const st4xx = Object.freeze({
    /**
     * The 400 (Bad Request) status code indicates that the server cannot or will not process the request due to something that is perceived to be a client error 
     * (e.g., malformed request syntax, invalid request message framing, or deceptive request routing)
     */
    badRequest: 400,

    /**
     * The 401 (Unauthorized) status code indicates that the request has not been applied because it lacks valid authentication credentials for the target resource.
     * The server generating a 401 response MUST send a WWW-Authenticate header field
     */
    unauthorized: 401,

    /**
     * The 403 (Forbidden) status code indicates that the server understood the request but refuses to fulfill it.
     *  A server that wishes to make public why the request has been forbidden can describe that reason in the response content
     */
    forbidden: 403,

    /**
     * The 404 (Not Found) status code indicates that the origin server did not find a current representation for the target resource or is not willing to disclose that one exists.
     * A 404 status code does not indicate whether this lack of representation is temporary or permanent;
     */
    notFound: 404,

    /**
     * The 429 status code indicates that the user has sent too many
     * requests in a given amount of time ("rate limiting").
     * The response representations SHOULD include details explaining the
     * condition, and MAY include a Retry-After header indicating how long
     * to wait before making a new request.
     */
    tooManyRequest: 429,
});

/**
 * The server failed to fulfill an apparently valid request
 */
export const st5xx = Object.freeze({

    /**
     * The 500 (Internal Server Error) status code indicates that the server encountered an unexpected condition that prevented it from fulfilling the request.
     */
    internalServerError: 500,
});