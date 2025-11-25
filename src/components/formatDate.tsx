export function formatDate(dateString: string) {
  const date = new Date(dateString);

  return date.toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}