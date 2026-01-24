import type {
	DateTruncFields,
	Interval,
	Resolutions,
} from "../services/form.analytics";

export const getTimeSeriesResolution = (interval: Interval): Resolutions => {
	if (interval === "24h") return "3 hours";
	if (interval === "7d") return "1 day";
	if (interval === "30d") return "1 week";
	if (interval === "3M" || interval === "6M" || interval === "1Y")
		return "1 month";

	return "1 hour";
};

export const getDateTruncField = (interval: Interval): DateTruncFields => {
	if (interval === "7d") return "day";
	if (interval === "30d") return "week";
	if (interval === "3M" || interval === "6M" || interval === "1Y")
		return "month";

	return "hour";
};
