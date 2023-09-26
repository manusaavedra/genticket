import { create } from "zustand";

export const useFoodStore = create(() => ({
    foods: [],
    currentFood: null
}))