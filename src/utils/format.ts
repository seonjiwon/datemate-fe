/**
 * 포맷 유틸리티
 * 1. 시간(분) → 사람이 읽기 좋은 문자열 변환
 * 2. 금액 → 원화 표기 변환
 */

/** 분 단위 시간을 "1시간 30분" 형태로 변환 */
export const formatDuration = (minutes: number): string => {
  if (minutes < 60) return `${minutes}분`;

  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (mins === 0) return `${hours}시간`;
  return `${hours}시간 ${mins}분`;
};

/** 금액을 "30,000원" 형태로 변환 */
export const formatCost = (cost: number): string => {
  return `${cost.toLocaleString("ko-KR")}원`;
};

/** 금액 범위를 "1~3만원" 형태로 변환 */
export const formatCostRange = (min: number, max: number): string => {
  const formatUnit = (v: number) => {
    if (v >= 10000) return `${v / 10000}만`;
    return `${v.toLocaleString("ko-KR")}`;
  };
  return `${formatUnit(min)}~${formatUnit(max)}원`;
};

/** "HH:mm" 형태의 시간에 분을 더한 결과 반환 */
export const addMinutesToTime = (time: string, minutes: number): string => {
  const [h, m] = time.split(":").map(Number);
  const totalMinutes = h * 60 + m + minutes;
  const newH = Math.floor(totalMinutes / 60) % 24;
  const newM = totalMinutes % 60;
  return `${String(newH).padStart(2, "0")}:${String(newM).padStart(2, "0")}`;
};
