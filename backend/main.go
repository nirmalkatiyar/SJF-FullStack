package main

import (
	"log"
	"net/http"

	"gihub.com/nirmalkatiyar/sjf/handler"
	"gihub.com/nirmalkatiyar/sjf/utils"

	"github.com/gorilla/mux"
)

const PORT = ":8080"

func main() {
	router := mux.NewRouter()
	// to add a job
	router.HandleFunc("/jobs", handler.CreateJob).Methods("POST")
	// to toggle between preemptive and non preemptive
	router.HandleFunc("/preempt", handler.Preempt).Methods("POST")
	// to get all jobs
	router.HandleFunc("/jobs", handler.GetJobs).Methods("GET")
	// to handle websocket connections
	router.HandleFunc("/ws", handler.HandleConnections)

	// Handle CORS preflight requests
	router.Methods("OPTIONS").HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		utils.SetCORSHeaders(w)
		w.WriteHeader(http.StatusOK)
	})

	go handler.HandleJobs()

	log.Println("Server started on", PORT)
	log.Fatal(http.ListenAndServe(PORT, router))
}
