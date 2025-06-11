import { Room, Client } from "colyseus";

export class MyRoom extends Room {
    onCreate() {
        this.onMessage("play", (client, message) => {
        // ゲーム処理
        this.broadcast("update", result);
        });
    }
}