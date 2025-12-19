import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { uploadFile, deleteFile } from "@/lib/storage";
import { prisma } from "@/lib/prisma";

// Allowed file types for avatars
const ALLOWED_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/gif",
  "image/webp",
];

// Maximum file size: 800KB
const MAX_FILE_SIZE = 800 * 1024;

/**
 * POST /api/upload/avatar
 * Upload a new avatar for the authenticated user
 */
export async function POST(request: NextRequest) {
  try {
    // Get authenticated session
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse form data
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        {
          error: "Invalid file type. Allowed types: JPG, PNG, GIF, WebP",
        },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File too large. Maximum size is 800KB" },
        { status: 400 }
      );
    }

    // Delete old avatar if exists
    const currentUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { image: true },
    });

    if (currentUser?.image) {
      try {
        await deleteFile(currentUser.image);
      } catch (error) {
        // Log but don't fail if old file deletion fails
        console.error("Failed to delete old avatar:", error);
      }
    }

    // Upload new avatar
    const result = await uploadFile(file, {
      folder: "avatars",
      filename: `${session.user.id}-${Date.now()}`,
    });

    // Update user's image in database
    await prisma.user.update({
      where: { id: session.user.id },
      data: { image: result.url },
    });

    return NextResponse.json({
      success: true,
      url: result.url,
    });
  } catch (error) {
    console.error("Avatar upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload avatar" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/upload/avatar
 * Remove the current avatar for the authenticated user
 */
export async function DELETE() {
  try {
    // Get authenticated session
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get current user's image
    const currentUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { image: true },
    });

    if (currentUser?.image) {
      // Delete the file from storage
      await deleteFile(currentUser.image);

      // Clear user's image in database
      await prisma.user.update({
        where: { id: session.user.id },
        data: { image: null },
      });
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("Avatar delete error:", error);
    return NextResponse.json(
      { error: "Failed to delete avatar" },
      { status: 500 }
    );
  }
}
