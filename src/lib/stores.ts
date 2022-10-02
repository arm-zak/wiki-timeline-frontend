import { writable } from "svelte/store";
import type { Game } from "common";
import type { Socket } from "socket.io-client";

export const game = writable<Game>()
export const yourPlayerId = writable<string>()
export const shownPlayerId = writable<string>()
export const socket = writable<Socket>()