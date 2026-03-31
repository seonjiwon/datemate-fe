/** API 공통 응답 래퍼 */
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string | null;
}

/** API 에러 응답 */
export interface ApiError {
  success: false;
  data: null;
  message: string;
  code: string;
}
