export function greetingKey(timezone: "IST" | "UTC") {
  const hour = Number(
    new Date().toLocaleString("en-GB", { hour: "2-digit", hour12: false, timeZone: timezone === "UTC" ? "UTC" : "Asia/Kolkata" })
  );
  return hour < 12 ? "greetMorning" : hour < 17 ? "greetAfternoon" : "greetEvening";
}
