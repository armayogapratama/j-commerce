function GlobalResponse<T>(data: T, message: string, status: string) {
  return {
    message,
    status,
    data,
  };
}

module.exports = {
  GlobalResponse,
};
