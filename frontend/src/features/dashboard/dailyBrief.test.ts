import { describe, expect, test } from "vitest";
import { buildDailyBrief, type BriefInput } from "./dailyBrief";
import { AQI_BANDS } from "../../utils/aqi";

const base: BriefInput = { ward: "Anand Vihar", aqi: 254, forecastAqi: 222, pm2_5: 89.5, pm10: 303.7, wind: 2.2, humidity: 28, temperature: 34.7 };

describe("buildDailyBrief", () => {
  test("is built from the readings", () => {
    const b = buildDailyBrief(base, "en");
    expect(b.currentSituation).toBe("Anand Vihar is at AQI 254 (Poor). Main pollutant: PM10.");
    expect(b.keyRisks.join(" ")).toMatch(/Calm air/);
    expect(b.keyRisks.join(" ")).toMatch(/Coarse dust/);
    expect(b.forecast).toContain("222");
    expect(b.forecast).toContain("falling");
  });

  test("clean, breezy day has no invented risks", () => {
    const b = buildDailyBrief({ ...base, aqi: 30, forecastAqi: 32, pm2_5: 15, pm10: 25, wind: 5, humidity: 50, temperature: 28 }, "en");
    expect(b.keyRisks).toEqual(["No major risk factors beyond the current AQI."]);
    expect(b.recommendedActions[0]).toMatch(/outdoor/i);
  });

  test("every language covers every CPCB band", () => {
    for (const lang of ["en", "hi", "te", "ta", "kn"]) {
      for (const band of AQI_BANDS) {
        const aqi = Number.isFinite(band.max) ? band.max : 450;
        const b = buildDailyBrief({ ...base, aqi }, lang);
        expect(b.recommendedActions.length).toBeGreaterThan(0);
        expect(b.currentSituation).toContain(String(aqi));
      }
    }
  });

  test("unknown language falls back to English", () => {
    expect(buildDailyBrief(base, "xx").currentSituation).toContain("is at AQI");
  });
});
