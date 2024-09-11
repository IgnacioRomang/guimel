export class Http {
  public static msg = {
    SUCCESS: "SUCCESS",
    FAILED: "FAILED",
    NOT_FOUND: "NOT_FOUND",
    INVALID_INPUT: "INVALID_INPUT",
    DB_ERROR: "DB_ERROR",
    UNAUTHORIZED: "UNAUTHORIZED",
    FORBIDDEN: "FORBIDDEN",
    METHOD_NOT_ALLOWED: "METHOD_NOT_ALLOWED",
    CONFLICT: "CONFLICT",
    INTERNAL_SERVER_ERROR: "INTERNAL_SERVER_ERROR",
    SERVICE_UNAVAILABLE: "SERVICE_UNAVAILABLE",
    CONTINUE: "CONTINUE",
    SWITCHING_PROTOCOLS: "SWITCHING_PROTOCOLS",
    EARLY_HINTS: "EARLY_HINTS",
    CREATED: "CREATED",
    ACCEPTED: "ACCEPTED",
    NON_AUTHORITATIVE_INFORMATION: "NON_AUTHORITATIVE_INFORMATION",
    NO_CONTENT: "NO_CONTENT",
    RESET_CONTENT: "RESET_CONTENT",
    PARTIAL_CONTENT: "PARTIAL_CONTENT",
    MULTI_STATUS: "MULTI_STATUS",
    ALREADY_REPORTED: "ALREADY_REPORTED",
    IM_USED: "IM_USED",
    MOVED_PERMANENTLY: "MOVED_PERMANENTLY",
    FOUND: "FOUND",
    SEE_OTHER: "SEE_OTHER",
    NOT_MODIFIED: "NOT_MODIFIED",
    USE_PROXY: "USE_PROXY",
    SWITCH_PROXY: "SWITCH_PROXY",
    TEMPORARY_REDIRECT: "TEMPORARY_REDIRECT",
    PERMANENT_REDIRECT: "PERMANENT_REDIRECT",
    BAD_REQUEST: "BAD_REQUEST",
    PAYMENT_REQUIRED: "PAYMENT_REQUIRED",
    NOT_ACCEPTABLE: "NOT_ACCEPTABLE",
    PROXY_AUTHENTICATION_REQUIRED: "PROXY_AUTHENTICATION_REQUIRED",
    REQUEST_TIMEOUT: "REQUEST_TIMEOUT",
    GONE: "GONE",
    LENGTH_REQUIRED: "LENGTH_REQUIRED",
    PRECONDITION_FAILED: "PRECONDITION_FAILED",
    PAYLOAD_TOO_LARGE: "PAYLOAD_TOO_LARGE",
    URI_TOO_LONG: "URI_TOO_LONG",
    UNSUPPORTED_MEDIA_TYPE: "UNSUPPORTED_MEDIA_TYPE",
    RANGE_NOT_SATISFIABLE: "RANGE_NOT_SATISFIABLE",
    EXPECTATION_FAILED: "EXPECTATION_FAILED",
    IM_A_TEAPOT: "IM_A_TEAPOT",
    MISDIRECTED_REQUEST: "MISDIRECTED_REQUEST",
    UNPROCESSABLE_ENTITY: "UNPROCESSABLE_ENTITY",
    LOCKED: "LOCKED",
    FAILED_DEPENDENCY: "FAILED_DEPENDENCY",
    TOO_EARLY: "TOO_EARLY",
    UPGRADE_REQUIRED: "UPGRADE_REQUIRED",
    PRECONDITION_REQUIRED: "PRECONDITION_REQUIRED",
    TOO_MANY_REQUESTS: "TOO_MANY_REQUESTS",
    REQUEST_HEADER_FIELDS_TOO_LARGE: "REQUEST_HEADER_FIELDS_TOO_LARGE",
    UNAVAILABLE_FOR_LEGAL_REASONS: "UNAVAILABLE_FOR_LEGAL_REASONS",
    NOT_IMPLEMENTED: "NOT_IMPLEMENTED",
    BAD_GATEWAY: "BAD_GATEWAY",
    GATEWAY_TIMEOUT: "GATEWAY_TIMEOUT",
    HTTP_VERSION_NOT_SUPPORTED: "HTTP_VERSION_NOT_SUPPORTED",
    VARIANT_ALSO_NEGOTIATES: "VARIANT_ALSO_NEGOTIATES",
    INSUFFICIENT_STORAGE: "INSUFFICIENT_STORAGE",
    LOOP_DETECTED: "LOOP_DETECTED",
    NOT_EXTENDED: "NOT_EXTENDED",
    NETWORK_AUTHENTICATION_REQUIRED: "NETWORK_AUTHENTICATION_REQUIRED",
  };

  public static code = {
    CONTINUE: 100,
    SWITCHING_PROTOCOLS: 101,
    EARLY_HINTS: 103,
    SUCCESS: 200,
    CREATED: 201,
    ACCEPTED: 202,
    NON_AUTHORITATIVE_INFORMATION: 203,
    NO_CONTENT: 204,
    RESET_CONTENT: 205,
    PARTIAL_CONTENT: 206,
    MULTI_STATUS: 207,
    ALREADY_REPORTED: 208,
    IM_USED: 226,
    MOVED_PERMANENTLY: 301,
    FOUND: 302,
    SEE_OTHER: 303,
    NOT_MODIFIED: 304,
    USE_PROXY: 305,
    SWITCH_PROXY: 306,
    TEMPORARY_REDIRECT: 307,
    PERMANENT_REDIRECT: 308,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    PAYMENT_REQUIRED: 402,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    METHOD_NOT_ALLOWED: 405,
    NOT_ACCEPTABLE: 406,
    PROXY_AUTHENTICATION_REQUIRED: 407,
    REQUEST_TIMEOUT: 408,
    CONFLICT: 409,
    GONE: 410,
    LENGTH_REQUIRED: 411,
    PRECONDITION_FAILED: 412,
    PAYLOAD_TOO_LARGE: 413,
    URI_TOO_LONG: 414,
    UNSUPPORTED_MEDIA_TYPE: 415,
    RANGE_NOT_SATISFIABLE: 416,
    EXPECTATION_FAILED: 417,
    IM_A_TEAPOT: 418,
    MISDIRECTED_REQUEST: 421,
    UNPROCESSABLE_ENTITY: 422,
    LOCKED: 423,
    FAILED_DEPENDENCY: 424,
    TOO_EARLY: 425,
    UPGRADE_REQUIRED: 426,
    PRECONDITION_REQUIRED: 428,
    TOO_MANY_REQUESTS: 429,
    REQUEST_HEADER_FIELDS_TOO_LARGE: 431,
    UNAVAILABLE_FOR_LEGAL_REASONS: 451,
    INTERNAL_SERVER_ERROR: 500,
    NOT_IMPLEMENTED: 501,
    BAD_GATEWAY: 502,
    SERVICE_UNAVAILABLE: 503,
    GATEWAY_TIMEOUT: 504,
    HTTP_VERSION_NOT_SUPPORTED: 505,
    VARIANT_ALSO_NEGOTIATES: 506,
    INSUFFICIENT_STORAGE: 507,
    LOOP_DETECTED: 508,
    NOT_EXTENDED: 510,
    NETWORK_AUTHENTICATION_REQUIRED: 511,
  };
}