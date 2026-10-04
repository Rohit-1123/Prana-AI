import { afterEach, describe, expect, test, vi } from "vitest";
import { askCopilot } from "./api";

const ward = { name: "Whitefield", aqi: 36, pm2_5: 21.6 };

afterEach(() => vi.restoreAllMocks());

describe("askCopilot", () => {
  test("sends live context and returns the answer", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true, status: 200,
      json: async () => ({ advisory_response: "Air is clean.", recommended_clean_routes: [] })
    });
    vi.stubGlobal("fetch", fetchMock);

    const reply = await askCopilot("Can I jog?", ward, [ward], "hi", [{ sender: "user", text: "hello" }]);
    const body = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(reply.text).toBe("Air is clean.");
    expect(body).toMatchObject({ query: "Can I jog?", language: "hi", ward: { name: "Whitefield", aqi: 36, city: "Bangalore" } });
    expect(body.history).toEqual([{ role: "user", text: "hello" }]);
  });

  test("rate limit gives a friendly message", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false, status: 429 }));
    expect((await askCopilot("x", ward, [], "en")).text).toMatch(/wait/i);
  });

  test("offline fallback states the last real reading, nothing invented", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("down")));
    const reply = await askCopilot("x", ward, [], "en");
    expect(reply.text).toContain("AQI 36");
    expect(reply.text).toContain("Good");
  });
});
