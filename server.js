import express from "express";
import http from "http";
import { WebSocketServer } from "ws";

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

let users = {};

wss.on("connection", (ws) => {
  ws.on("message", (message) => {
    const data = JSON.parse(message);

    switch (data.type) {
      case "join":
        users[data.username] = ws;
        ws.username = data.username;
        console.log(`${data.username} joined`);
        break;

      case "offer":
        if (users[data.target]) {
          users[data.target].send(JSON.stringify({ type: "offer", offer: data.offer, from: data.from }));
        }
        break;

      case "answer":
        if (users[data.target]) {
          users[data.target].send(JSON.stringify({ type: "answer", answer: data.answer, from: data.from }));
        }
        break;

      case "ice-candidate":
        if (users[data.target]) {
          users[data.target].send(JSON.stringify({ type: "ice-candidate", candidate: data.candidate, from: data.from }));
        }
        break;

      case "leave":
        delete users[data.username];
        console.log(`${data.username} left`);
        break;
    }
  });

  ws.on("close", () => {
    if (ws.username) {
      delete users[ws.username];
      console.log(`${ws.username} disconnected`);
    }
  });
});

server.listen(5000, () => console.log("WebSocket server running on port 5000"));
