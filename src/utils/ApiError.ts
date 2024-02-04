class ApiError extends Error {
  constructor(
    public statusCode: number,
    public message: string = 'Something went wrong',
    public error?: Array<Object> | any,
    public stack?: string
  ) {
    super(message);
    this.data = null;
    this.success = false;

    if (stack) this.stack = stack;
    else Error.captureStackTrace(this, this.constructor);
  }
  data: null | any;
  success: boolean;
}

export { ApiError };
