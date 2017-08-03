package tags

import (
	//"fmt"
    //"net/http"
    //"log"
    //"encoding/json"
)

type TeaField struct {
	TeaOperation TeaOperation `json:"teaOperation"`
}

type TeaOperation struct {
	MethodType string `json:"methodType"`
}