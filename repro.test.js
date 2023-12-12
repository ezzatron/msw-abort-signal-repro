import { http } from "msw";
import { setupServer } from "msw/node";
import { afterAll, beforeAll, expect, it } from "vitest";

const server = setupServer(
  http.post("http://localhost", async ({ request }) => {
    await request.text();

    return new Response("");
  }),
);

beforeAll(() => {
  server.listen();
});

afterAll(() => {
  server.close();
});

it("should support AbortSignal", async () => {
  const controller = new AbortController();
  controller.abort();

  const callFetch = async () => {
    await fetch("http://localhost", {
      signal: controller.signal,
      method: "POST",
      body: "",
    });
  };

  await expect(callFetch()).rejects.toThrow(/aborted/i);
});
