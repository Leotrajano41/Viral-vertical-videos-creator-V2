import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { filename, fileType, projectId, userId = "user_default" } = body;

    if (!filename || !projectId) {
      return NextResponse.json({ error: "Parâmetros 'filename' e 'projectId' são obrigatórios" }, { status: 400 });
    }

    const s3Key = `users/${userId}/projects/${projectId}/knowledge/${Date.now()}_${filename}`;
    const presignedUrl = `https://viral-creator-prod-bucket.s3.amazonaws.com/${s3Key}?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Expires=900`;

    return NextResponse.json({
      status: "SUCCESS",
      uploadUrl: presignedUrl,
      s3Key,
      expiresInSec: 900,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
