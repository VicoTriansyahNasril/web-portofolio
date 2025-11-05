package websocket

import (
	"encoding/json"
	"log"
	"sync"

	"github.com/gorilla/websocket"
)

type Hub struct {
	clients    map[*websocket.Conn]bool
	broadcast  chan []byte
	register   chan *websocket.Conn
	unregister chan *websocket.Conn
	mu         sync.Mutex
}

var hub *Hub

func init() {
	hub = &Hub{
		broadcast:  make(chan []byte),
		register:   make(chan *websocket.Conn),
		unregister: make(chan *websocket.Conn),
		clients:    make(map[*websocket.Conn]bool),
	}
	go hub.run()
}

func GetHub() *Hub {
	return hub
}

func (h *Hub) run() {
	for {
		select {
		case client := <-h.register:
			h.mu.Lock()
			h.clients[client] = true
			h.mu.Unlock()
		case client := <-h.unregister:
			h.mu.Lock()
			if _, ok := h.clients[client]; ok {
				delete(h.clients, client)
				client.Close()
			}
			h.mu.Unlock()
		case message := <-h.broadcast:
			h.mu.Lock()
			for client := range h.clients {
				if err := client.WriteMessage(websocket.TextMessage, message); err != nil {
					log.Printf("websocket error: %v", err)
					client.Close()
					delete(h.clients, client)
				}
			}
			h.mu.Unlock()
		}
	}
}

func (h *Hub) RegisterClient(client *websocket.Conn) {
	h.register <- client
}

func (h *Hub) UnregisterClient(client *websocket.Conn) {
	h.unregister <- client
}

type BroadcastMessage struct {
	Event string `json:"event"`
	Key   string `json:"key"`
}

func (h *Hub) BroadcastEvent(event, key string) {
	message := BroadcastMessage{Event: event, Key: key}
	jsonMessage, err := json.Marshal(message)
	if err != nil {
		log.Printf("Error marshalling broadcast message: %v", err)
		return
	}
	h.broadcast <- jsonMessage
}
