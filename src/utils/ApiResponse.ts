class ApiResponse {
  results: number;

  constructor(
    public statusCode: number,
    public data: object,
    public message: string = 'Success'
  ) {
    this.results = Object.keys(data).length;
  }
}

export { ApiResponse };
