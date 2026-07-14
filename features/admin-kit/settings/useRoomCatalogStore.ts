"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

import { Gender } from "@/lib/api/types";

export type CatalogRoom = {
  roomId: string;
  name: string;
  gender: Gender;
  capacity: number;
  updatedAt: string;
};

type RoomCatalogState = {
  rooms: CatalogRoom[];
  upsertRoom: (room: Omit<CatalogRoom, "updatedAt">) => void;
  removeRoom: (roomId: string) => void;
  findByNameGender: (name: string, gender: Gender) => CatalogRoom | undefined;
};

export const useRoomCatalogStore = create<RoomCatalogState>()(
  persist(
    (set, get) => ({
      rooms: [],
      upsertRoom: (room) =>
        set((state) => {
          const roomId = room.roomId.trim();
          if (!roomId) return state;
          const next: CatalogRoom = {
            ...room,
            roomId,
            name: room.name.trim() || roomId,
            updatedAt: new Date().toISOString(),
          };
          const without = state.rooms.filter((r) => r.roomId !== roomId);
          return { rooms: [next, ...without] };
        }),
      removeRoom: (roomId) =>
        set((state) => ({
          rooms: state.rooms.filter((r) => r.roomId !== roomId),
        })),
      findByNameGender: (name, gender) => {
        const key = name.trim().toLowerCase();
        return get().rooms.find(
          (r) => r.gender === gender && r.name.trim().toLowerCase() === key,
        );
      },
    }),
    { name: "mokeb-room-catalog" },
  ),
);
