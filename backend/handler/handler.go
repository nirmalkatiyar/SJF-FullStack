package handler

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"sort"
	"time"

	"gihub.com/nirmalkatiyar/sjf/model"
	"gihub.com/nirmalkatiyar/sjf/utils"
	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		// Allow all origins (not recommended for production)
		return true
	},
}

var enteredTime = time.Now()

// createJob creates a new job and adds to the Jobs list
func CreateJob(w http.ResponseWriter, r *http.Request) {
	utils.SetCORSHeaders(w)
	var job model.Job
	err := json.NewDecoder(r.Body).Decode(&job)
	if err != nil {
		fmt.Println("Parsing Failed ", err)
		w.WriteHeader(http.StatusBadRequest)
		w.Write([]byte("Parsing Failed"))
	}
	job.Status = "pending"
	job.RemTime = job.Duration
	utils.JobsMutex.Lock()
	utils.Jobs = append(utils.Jobs, job)
	utils.JobsMutex.Unlock()
	w.WriteHeader(http.StatusCreated)
	w.Write([]byte("Job added successfully"))
}

// to toggle between preemptive and non preemptive and add time quantum
func Preempt(w http.ResponseWriter, r *http.Request) {
	utils.SetCORSHeaders(w)
	var preempt model.Preempt
	err := json.NewDecoder(r.Body).Decode(&preempt)
	if err != nil {
		fmt.Println("Parsing Failed ", err)
		w.WriteHeader(http.StatusBadRequest)
		w.Write([]byte("Parsing Failed"))
	}
	utils.JobsMutex.Lock()
	fmt.Println(preempt)
	utils.IsPreemptive = preempt.IsPreemptive
	utils.TimeQuantum = preempt.TimeQuantum
	utils.Jobs = utils.Jobs[:0]
	utils.JobsMutex.Unlock()
	w.WriteHeader(http.StatusCreated)
}

// getJobs returns all Jobs with their status
func GetJobs(w http.ResponseWriter, r *http.Request) {
	utils.SetCORSHeaders(w)
	utils.JobsMutex.Lock()
	jobsToSend := utils.Jobs

	//we need to sort the Jobs such that the running job is at the top and the pending Jobs are sorted based on their duration
	sort.Slice(jobsToSend, func(i, j int) bool {
		if jobsToSend[i].Status == "running" {
			return true
		}
		if jobsToSend[j].Status == "running" {
			return false
		}
		return jobsToSend[i].Duration < jobsToSend[j].Duration
	})

	//if the job is not preemptive and there are pending Jobs, we need to update the remaining time of the job
	if !utils.IsPreemptive && len(jobsToSend) > 0 {
		fmt.Println(jobsToSend[0].Duration, time.Duration(time.Since(enteredTime).Seconds()), "###")
		jobsToSend[0].RemTime = jobsToSend[0].Duration - time.Duration(time.Since(enteredTime).Seconds())
	}
	data := model.Data{
		Preempt:     utils.IsPreemptive,
		TimeQuantum: utils.TimeQuantum,
		Pending:     jobsToSend,
		Completed:   utils.CompJobs,
	}
	json.NewEncoder(w).Encode(data)
	utils.JobsMutex.Unlock()
}

// handles WebSocket connections
func HandleConnections(w http.ResponseWriter, r *http.Request) {
	ws, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Printf("WebSocket upgrade error: %v", err)
		return
	}
	defer ws.Close()

	utils.WsMutex.Lock()
	utils.Clients[ws] = true
	utils.WsMutex.Unlock()

	for {
		_, _, err := ws.ReadMessage()
		if err != nil {
			utils.WsMutex.Lock()
			delete(utils.Clients, ws)
			utils.WsMutex.Unlock()
			break
		}
	}
}

// handleJobs handles the jobs in the queue and runs them
func HandleJobs() {
	for {
		utils.JobsMutex.Lock()
		if len(utils.Jobs) > 0 {
			sort.Slice(utils.Jobs, func(i, j int) bool {
				return utils.Jobs[i].RemTime < utils.Jobs[j].RemTime
			})
			anyPending := false
			fmt.Println(utils.Jobs)
			//if the job is pending, we need to run it
			if utils.Jobs[0].Status == "pending" {
				enteredTime = time.Now()
				anyPending = true
				utils.JobsMutex.Unlock()
				// set the status of the job to running
				utils.Jobs[0].Status = "running"
				fmt.Println(int((utils.Jobs[0].RemTime * utils.NanoToSec).Seconds()))
				// if non preemptive or the remaining time of the job is less than the time quantum, we need to run the job till it completes
				if !utils.IsPreemptive || int((utils.Jobs[0].RemTime*utils.NanoToSec).Seconds()) <= utils.TimeQuantum {
					fmt.Println("lAST")
					// sleep for the remaining time of the job
					time.Sleep(utils.Jobs[0].RemTime * utils.NanoToSec)
					utils.Jobs[0].RemTime = 0
					// set the status of the job to completed and broadcast the status
					utils.Jobs[0].Status = "completed"
					utils.BroadcastJobStatus(utils.Jobs[0])
				} else {
					fmt.Println("Not last")
					if utils.Jobs[0].Duration == utils.Jobs[0].RemTime {
						utils.BroadcastJobStatus(utils.Jobs[0])
					}
					//sleep for time quantum and update the remaining time of the job
					time.Sleep(time.Duration(utils.TimeQuantum) * utils.NanoToSec)
					utils.Jobs[0].RemTime = utils.Jobs[0].RemTime - time.Duration(utils.TimeQuantum)
					isSorted := sort.SliceIsSorted(utils.Jobs, func(i, j int) bool {
						return utils.Jobs[i].RemTime < utils.Jobs[j].RemTime
					})
					// if the Jobs are not sorted based on the remaining time, we need to broadcast the status of the job that job is going to context switch
					if !isSorted {
						contextSwitch := utils.Jobs[0]
						contextSwitch.Status = "pending"
						contextSwitch.Msg = "CS"
						utils.BroadcastJobStatus(contextSwitch)
					}
					utils.Jobs[0].Status = "pending"
				}
				utils.JobsMutex.Lock()

			}
			// update th Jobs list and completed Jobs list
			if len(utils.Jobs) > 0 && utils.Jobs[0].Status == "completed" && anyPending {
				utils.CompJobs = append(utils.CompJobs, utils.Jobs[0])
				utils.Jobs = utils.Jobs[1:]
			}
		}
		utils.JobsMutex.Unlock()
	}
}
