package types

type Task struct {
	Principal string `json:"principal"`  
	OperationName string `json:"operationName"` 
	SessionId string `json:"sessionId"`
	SamlToken string `json:"samlToken"`
	MethodType string `json:"methodType"`
	ObjectType string `json:"objectType"` 
	Key string `json:"key"`
}



type TaskExecutionResponse struct {
	TaskId string `json:"taskId"`  
	Result string `json:"result"` 
	TaskStatus string `json:"taskStatus"`
	Progress string `json:"progress"`
	ProgressStatus string `json:"progressStatus"`
	StartTime string `json:"startTime"` 
	StopTime string `json:"stopTime"`
	Throwable string `json:"throwable"` 
	ErrorMessage string `json:"errorMessage"` 
}



func NewTaskExecutionResponse(taskId string, result string, taskStatus string, progress string, progressStatus string, startTime string, stopTime string, throwable string, errorMessage string) *TaskExecutionResponse {
	return &TaskExecutionResponse{TaskId: taskId, Result: result, TaskStatus: taskStatus, Progress: progress, ProgressStatus: progressStatus, StartTime: startTime, StopTime: stopTime, Throwable: throwable, ErrorMessage: errorMessage}
}