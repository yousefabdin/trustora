export const formatActivityDate = (date?: string | null) => {
  if (!date) return "";
  const parsedDate = new Date(date);
  if (isNaN(parsedDate.getTime())) return "";

  const month = parsedDate.toLocaleDateString("en-US", { month: "short" });
  const day = parsedDate.getDate();
  const hours = String(parsedDate.getHours()).padStart(2, "0");
  const minutes = String(parsedDate.getMinutes()).padStart(2, "0");
  return `${month} ${day}, ${hours}:${minutes}`;
};
export const formatDate = (date: string) => {
  const parsedDate = new Date(date);

  return `${parsedDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })}, ${parsedDate.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  })}`;
};

export const getTodayDate = () => {
  return new Date().toISOString().split("T")[0];
};
