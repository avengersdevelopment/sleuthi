import { create } from "zustand";
import { createJSONStorage } from "zustand/middleware";
import { persist } from "zustand/middleware";

interface Character {
  name: string;
  bgColor: string;
  primaryColor: string;
  secondaryColor: string;
  characterAssetPath: string;
}

const hawk: Character = {
  name: "Hawk",
  bgColor: "#F7F6F2",
  primaryColor: "#D6FF38",
  secondaryColor: "#FFAFEC",
  characterAssetPath: "",
};

const choco: Character = {
  name: "Choco",
  bgColor: "#FEF8E1",
  primaryColor: "#D6FF38",
  secondaryColor: "#FFAFEC",
  characterAssetPath: "",
};

const river: Character = {
  name: "River",
  bgColor: "#F4EEFE",
  primaryColor: "#D6FF38",
  secondaryColor: "#FFAFEC",
  characterAssetPath: "",
};

interface CharacterStore {
  character: Character;
  setCharacter: (character: Character) => void;
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
