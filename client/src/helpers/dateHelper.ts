export function getAbbreviatedDayOfWeek(dateString: Date) {
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const date = new Date(dateString);

  const dayOfWeek = date.getDay(); // 0 for Sunday, 1 for Monday, ...
  return daysOfWeek[dayOfWeek];
}

export function getAbbreviatedTimeFromTheDate(dateString: Date) {
  const date = new Date(dateString);

  return date.toLocaleString("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });
}
