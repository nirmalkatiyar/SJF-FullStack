package utils

import (
	"encoding/json"
	"log"
	"sync"

	"gihub.com/nirmalkatiyar/sjf/model"
	"github.com/gorilla/websocket"
)

var WsMutex sync.Mutex
var IsPreemptive = false
var TimeQuantum = 0

var Jobs []model.Job
var CompJobs []model.Job
var JobsMutex sync.Mutex

// WebSocket Clients
var Clients = make(map[*websocket.Conn]bool)




// broadcastJobStatus broadcasts the job status to all WebSocket Clients
func BroadcastJobStatus(job model.Job) {
	WsMutex.Lock()
	defer WsMutex.Unlock()
	message, _ := json.Marshal(job)
	for client := range Clients {
		err := client.WriteMessage(websocket.TextMessage, message)
		if err != nil {
			log.Printf("WebSocket error: %v", err)
			client.Close()
			delete(Clients, client)
		}
	}
}
