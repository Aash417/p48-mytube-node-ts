interface errorType {
  statusCode: number;
  message: string;
  error: Array<Object> | any;
  stack: string;
  data: any | null;
}

class ApiError extends Error implements errorType {
  constructor(
    statusCode: number,
    message: string = 'Something went wrong',
    error: Array<Object> | any,
    stack = ''
  ) {
    super(message);
    this.statusCode = statusCode;
    this.data = null;
    this.message = message;
    this.success = false;
    this.error = error;

    if (stack) this.stack = stack;
    else Error.captureStackTrace(this, this.constructor);
  }
  statusCode: number;
  error: any;
  stack: string;
  data: null | any;
  success: boolean;
}

export { ApiError };
