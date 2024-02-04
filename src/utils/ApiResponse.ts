class ApiResponse {
  success: boolean;

  constructor(
    public statusCode: number,
    public data: object,
    public message: string = 'Success'
  ) {
    this.success = statusCode < 400;
  }
}

export { ApiResponse };
