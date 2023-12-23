package box

import (
	"github.com/samber/lo"
	"strconv"
	"strings"
)

func ExtractNumber(str string) int {
	// Split the string by '/'
	parts := strings.Split(str, "/")

	// Get the last part of the split string
	lastPart := parts[0]

	// Convert the last part to an integer
	number, err := strconv.Atoi(lastPart)
	if err != nil {
		return 0
	}

	return number
}

func FindMaxNumber(boxes []*Box) int {
	if len(boxes) == 0 {
		return 0
	}

	BoxNoList := lo.Map(boxes, func(item *Box, _ int) int {
		return ExtractNumber(item.BoxCode)
	})

	return lo.Max(BoxNoList)
}
