import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    return NextResponse.json(
      {
        status: false,
        code: "UNAUTHORIZED",
        message: "Unauthorized",
        data: null,
        errors: null,
      },
      { status: 401 }
    );
  }

  const data = await auth.api.viewBackupCodes({
    body: {
      userId: session.user.id,
    },
  });

  return NextResponse.json({
    status: true,
    code: "SUCCESS",
    message: "Backup codes retrieved successfully",
    data: data.backupCodes,
    errors: null,
  });
}
