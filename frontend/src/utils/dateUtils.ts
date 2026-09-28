export const formatActivityDate = (date: string) => {
  const parsedDate = new Date(date);

  return `${parsedDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  })}, ${parsedDate.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  })}`;
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
