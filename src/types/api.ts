/**
 * 백엔드 CustomResponse 래퍼
 * 1. isSuccess: 성공 여부
 * 2. result: 실제 데이터 (제네릭)
 * 3. status, code, message: 상태 정보
 */
export interface ApiResponse<T> {
  isSuccess: boolean;
  status: string;
  code: string;
  message: string;
  result: T;
}

/** API 에러 응답 */
export interface ApiError {
  isSuccess: false;
  status: string;
  code: string;
  message: string;
  result: null;
}
