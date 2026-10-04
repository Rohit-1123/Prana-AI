import { describe, expect, test } from "vitest";
import { aqiLabel, aqiPosition, mainPollutant } from "./aqi";

describe("CPCB bands", () => {
  test("boundaries", () => {
    expect(aqiLabel(50)).toBe("Good");
    expect(aqiLabel(51)).toBe("Satisfactory");
    expect(aqiLabel(200)).toBe("Moderate");
    expect(aqiLabel(254)).toBe("Poor");
    expect(aqiLabel(400)).toBe("Very Poor");
    expect(aqiLabel(450)).toBe("Severe");
  });

  test("main pollutant follows the higher sub-index", () => {
    expect(mainPollutant(89.5, 303.7)).toBe("PM10");
    expect(mainPollutant(43, 62)).toBe("PM2.5");
  });

  test("scale marker stays within 0-100 and increases with AQI", () => {
    expect(aqiPosition(0)).toBe(0);
    expect(aqiPosition(500)).toBeLessThanOrEqual(100);
    expect(aqiPosition(900)).toBeLessThanOrEqual(100);
    expect(aqiPosition(120)).toBeGreaterThan(aqiPosition(60));
  });
});
