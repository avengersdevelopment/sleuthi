import { create } from "zustand";
import { createJSONStorage } from "zustand/middleware";
import { persist } from "zustand/middleware";

export interface ICharacter {
  name: string;
  bgColor: string;
  primaryColor: string;
  secondaryColor: string;
}

export const hawk: ICharacter = {
  name: "Hawk",
  bgColor: "#F7F6F2",
  primaryColor: "#D6FF38",
  secondaryColor: "#FFAFEC",
};

export const choco: ICharacter = {
  name: "Choco",
  bgColor: "#FFF8E1",
  primaryColor: "#FF6B6B",
  secondaryColor: "#5DD9C1",
};

export const river: ICharacter = {
  name: "River",
  bgColor: "#F4EEFF",
  primaryColor: "#81F495",
  secondaryColor: "#FFC75F",
};

interface CharacterStore {
  character: ICharacter;
  setCharacter: (character: ICharacter) => void;
}

export const useCharacterStore = create<CharacterStore>()(
  persist(
    (set) => ({
      character: hawk,
      setCharacter: (character) => set({ character: character }),
    }),
    {
      name: "character-storage", // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
    },
  ),
);
