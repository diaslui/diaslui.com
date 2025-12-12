import type { BunRequest } from "bun";

const clients = new Set<ReadableStreamDefaultController>();

export const sendAllBySse = (data: unknown) => {
  const payload = `data: ${JSON.stringify(data)}\n\n`;

  for (const controller of clients) {
    try {
      controller.enqueue(payload);
    } catch {
      clients.delete(controller);
    }
  }
};

export const lastFmSseController = (req: BunRequest) => {
  let localController: ReadableStreamDefaultController;

  const stream = new ReadableStream({
    start(controller) {
      localController = controller;
      clients.add(controller);

      controller.enqueue(`retry: 3000\n\n`);
    },

    cancel() {
      clients.delete(localController);
    },
  });

  return new Response(stream, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "text/event-stream;charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
};
