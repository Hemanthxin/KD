import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";

const ALLOWED_CONTENT_TYPES = [
  "audio/mpeg",
  "audio/mp4",
  "audio/x-m4a",
  "audio/wav",
  "audio/x-wav",
  "audio/ogg",
  "audio/webm",
  "audio/aac",
  "audio/3gpp",
];

const MAX_SIZE_BYTES = 150 * 1024 * 1024; // 150MB

export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (_pathname, clientPayload) => {
        const session = await getSession();
        if (!session || session.role !== "EMPLOYEE") {
          throw new Error("Not authenticated");
        }

        if (!clientPayload) {
          throw new Error("Missing lead reference");
        }
        const { leadId } = JSON.parse(clientPayload) as { leadId?: string };
        if (!leadId) {
          throw new Error("Missing lead reference");
        }

        const lead = await db.lead.findUnique({ where: { id: leadId } });
        if (!lead || lead.assignedToId !== session.uid) {
          throw new Error("You don't have this lead assigned");
        }

        return {
          allowedContentTypes: ALLOWED_CONTENT_TYPES,
          maximumSizeInBytes: MAX_SIZE_BYTES,
          addRandomSuffix: true,
          tokenPayload: JSON.stringify({
            leadId,
            employeeId: session.uid,
          }),
        };
      },
      onUploadCompleted: async () => {
        // Persistence happens via the addCallRecording server action, called
        // directly by the client once upload() resolves. Nothing to do here.
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 }
    );
  }
}
