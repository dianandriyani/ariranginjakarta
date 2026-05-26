export function getJakartaDate() {
  return new Date(
    new Date().toLocaleString("en-US", {
      timeZone: "Asia/Jakarta",
    }),
  );
}

export function getJakartaHour() {
  return getJakartaDate().getHours();
}
