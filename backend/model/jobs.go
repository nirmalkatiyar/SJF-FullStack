package model

import "time"

type Job struct {
	Name     string        `json:"name"`
	Duration time.Duration `json:"duration"`
	Status   string        `json:"status"`
	RemTime  time.Duration `json:"remTime"`
	Msg      string        `json:"msg"`
}

type Preempt struct {
	IsPreemptive bool `json:"isPreemptive"`
	TimeQuantum  int  `json:"timeQuantum"`
}

type Data struct {
	Pending     []Job `json:"pending"`
	Completed   []Job `json:"completed"`
	Preempt     bool  `json:"preempt"`
	TimeQuantum int   `json:"timeQuantum"`
}