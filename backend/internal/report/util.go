package report

import (
	"strconv"
	"strings"
)

func extractNumber(str string) int {
	// Split the string by '/'
	parts := strings.Split(str, "/")

	// Get the last part of the split string
	lastPart := parts[len(parts)-1]

	// Convert the last part to an integer
	number, err := strconv.Atoi(lastPart)
	if err != nil {
		return 0
	}

	return number
}

func findFinalValue(arr []string) (int, string) {
	// get the last element of the array
	lastElement := arr[len(arr)-1]
	finalValue := extractNumber(lastElement)
	monthYear := ExtractMonthYear(lastElement)

	return finalValue, monthYear
}

func ExtractMonthYear(str string) string {
	// Split the string by '/'
	parts := strings.Split(str, "/")

	// Get the second-to-last part of the split string
	secondToLastPart := parts[len(parts)-2]

	return secondToLastPart
}
