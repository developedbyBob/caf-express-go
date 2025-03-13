package service

// CalculateDeliveryCosts calcula os custos de entrega com base nos pesos
func CalculateDeliveryCosts(weights []float64) float64 {
	var total float64

	for _, weight := range weights {
		if weight > 0.3 {
			total += 3.0
		} else {
			total += 2.0
		}
	}

	return total
}