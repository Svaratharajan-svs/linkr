package dto

type DailyStats struct {
	Date  string `json:"date"`
	Count int    `json:"count"`
}

type StatsResponse struct {
	TotalClicks int `json:"total_clicks"`

	Daily []DailyStats `json:"daily"`
}
