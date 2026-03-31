import { create } from "zustand";
import type { Mood, Transport, Course } from "@/src/types/course";
import type { StationCandidate } from "@/src/types/station";

/**
 * 코스 생성 플로우 상태 스토어
 * 1. 출발지 → 중간역 → 조건 → 결과까지의 단계별 데이터 보관
 * 2. 플로우 완료 또는 이탈 시 reset으로 초기화
 */

interface CourseFlowState {
  // ── 1단계: 출발지 ──
  originA: string;
  originALat: number | null;
  originALng: number | null;
  originB: string;
  originBLat: number | null;
  originBLng: number | null;

  // ── 2단계: 중간역 후보 및 선택 ──
  stationCandidates: StationCandidate[];
  selectedStation: StationCandidate | null;

  // ── 3단계: 조건 ──
  budgetMin: number;
  budgetMax: number;
  mood: Mood | null;
  transport: Transport | null;

  // ── 4단계: 결과 ──
  courseRequestId: number | null;
  courseResults: Course[];
}

interface CourseFlowActions {
  /** 출발지 설정 */
  setOrigins: (params: {
    originA: string;
    originALat: number;
    originALng: number;
    originB: string;
    originBLat: number;
    originBLng: number;
  }) => void;

  /** 중간역 후보 목록 설정 */
  setStationCandidates: (candidates: StationCandidate[]) => void;

  /** 중간역 선택 */
  selectStation: (station: StationCandidate) => void;

  /** 조건 설정 */
  setConditions: (params: {
    budgetMin: number;
    budgetMax: number;
    mood: Mood;
    transport: Transport;
  }) => void;

  /** AI 코스 결과 설정 */
  setCourseResults: (requestId: number, courses: Course[]) => void;

  /** 전체 상태 초기화 */
  reset: () => void;
}

const initialState: CourseFlowState = {
  originA: "",
  originALat: null,
  originALng: null,
  originB: "",
  originBLat: null,
  originBLng: null,
  stationCandidates: [],
  selectedStation: null,
  budgetMin: 0,
  budgetMax: 50_000,
  mood: null,
  transport: null,
  courseRequestId: null,
  courseResults: [],
};

export const useCourseStore = create<CourseFlowState & CourseFlowActions>(
  (set) => ({
    ...initialState,

    setOrigins: (params) => set(params),

    setStationCandidates: (candidates) =>
      set({ stationCandidates: candidates }),

    selectStation: (station) => set({ selectedStation: station }),

    setConditions: (params) => set(params),

    setCourseResults: (requestId, courses) =>
      set({ courseRequestId: requestId, courseResults: courses }),

    reset: () => set(initialState),
  })
);
