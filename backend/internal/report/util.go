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

func findMaxValue(arr []string) int {
	// Initialize max to the minimum possible integer value
	max := 0
	// Iterate over the array and find the maximum value
	for _, value := range arr {
		num := extractNumber(value)

		// Update max if the current number is larger
		if num > max {
			max = num
		}
	}

	return max
}

func ExtractMonthYear(str string) string {
	// Split the string by '/'
	parts := strings.Split(str, "/")

	// Get the second-to-last part of the split string
	secondToLastPart := parts[len(parts)-2]

	return secondToLastPart
}
