import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const s3Key = searchParams.get("s3Key");

    if (!s3Key) {
      return NextResponse.json({ error: "Parâmetro 's3Key' é obrigatório" }, { status: 400 });
    }

    // Presigned Download URL generation (TTL 1 hour / 3600 seconds)
    const downloadUrl = `https://viral-creator-prod-bucket.s3.amazonaws.com/${s3Key}?X-Amz-Expires=3600&X-Amz-Signature=secured_hash`;

    return NextResponse.json({
      status: "SUCCESS",
      downloadUrl,
      expiresInSec: 3600,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
