import { create } from "zustand";

export const usePhotoboothStore = create((set) => ({
  // --- Selection ---
  timer: 3, // seconds: 3 | 5 | 10
  shotCount: 3, // 3 | 4

  // --- Captured photos ---
  shots: [], // array of data URLs (jpeg)

  // --- Edit choices ---
  template: "Frame1",
  filter: "none",

  // --- Actions ---
  setTimer: (t) => set({ timer: t }),
  setShotCount: (s) => set({ shotCount: s }),
  setShots: (shots) => set({ shots }),
  replaceShot: (index, dataUrl) =>
    set((state) => {
      const shots = [...state.shots];
      shots[index] = dataUrl;
      return { shots };
    }),
  setTemplate: (t) => set({ template: t }),
  setFilter: (f) => set({ filter: f }),
  resetSession: () =>
    set({
      timer: 3,
      shotCount: 3,
      shots: [],
      template: "Frame1",
      filter: "none",
    }),
}));
