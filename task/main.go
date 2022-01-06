package main

import (
	"fmt"
	"os"
)

func main() {
	fmt.Printf("Bucket Name: %s\n", os.Getenv("S3_BUCKET"))
	fmt.Printf("Object Key: %s\n", os.Getenv("S3_KEY"))
}
