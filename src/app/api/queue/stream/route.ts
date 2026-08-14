import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const encoder = new TextEncoder();

  const customStream = new ReadableStream({
    async start(controller) {
      // Simulate real-time render progress event stream
      for (let progress = 10; progress <= 100; progress += 15) {
        const payload = JSON.stringify({
          jobId: "job_active_1",
          progress,
          status: progress === 100 ? "COMPLETED" : "PROCESSING",
          timestamp: new Date().toISOString(),
        });

        controller.enqueue(encoder.encode(`data: ${payload}\n\n`));
        await new Promise((r) => setTimeout(r, 1000));
      }

      controller.close();
    },
  });

  return new NextResponse(customStream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
