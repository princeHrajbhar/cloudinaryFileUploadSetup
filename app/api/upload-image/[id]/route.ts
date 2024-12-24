import { connectToDB } from "@/lib/mongoDB";
import { ImageGallaryModel } from "@/lib/image-model";
import { DeleteImage } from "@/lib/upload-image";
import { NextResponse } from "next/server";
import { UploadImage } from "@/lib/upload-image";

connectToDB();
export const GET = async (req: Request, { params }: { params: { id: string } }) => {
    try {
        // Ensure params are awaited before accessing them
        const { id } = await params;

        if (!id) {
            return NextResponse.json(
                { error: "Invalid request. No ID provided." },
                { status: 400 }
            );
        }

        // Fetch the image details from the database by ID
        const imageRecord = await ImageGallaryModel.findById(id);

        // If the image doesn't exist in the database
        if (!imageRecord) {
            return NextResponse.json(
                { error: "Image not found." },
                { status: 404 }
            );
        }

        // Return the image details, including the Cloudinary URL and public ID
        return NextResponse.json(
            { message: "Image details retrieved successfully", data: imageRecord },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error fetching image:", error);
        return NextResponse.json(
            { error: "An error occurred while fetching the image." },
            { status: 500 }
        );
    }
};

export const PUT = async (req: Request, { params }: { params: { id: string } }) => {
    try {
        // Ensure params are awaited before accessing them
        const { id } = await params;
        const formData = await req.formData();
        const image = formData.get("image") as unknown as File;
        const name = formData.get("name") as string;
        const email = formData.get("email") as string;

        if (!image || !name || !email) {
            return NextResponse.json(
                { error: "Image, name, and email are required" },
                { status: 400 }
            );
        }

        // Fetch the existing record from the database
        const existingRecord = await ImageGallaryModel.findById(id);
        if (!existingRecord) {
            return NextResponse.json({ error: "Record not found" }, { status: 404 });
        }

        // Delete the old image from Cloudinary using the public_id
        const cloudinaryDeleteResult = await DeleteImage(existingRecord.public_id);
        if (cloudinaryDeleteResult.result !== "ok") {
            return NextResponse.json({ error: "Failed to delete old image from Cloudinary" }, { status: 500 });
        }

        // Upload the new image to Cloudinary
        const cloudinaryUploadResult = await UploadImage(image, "nextjs-imagegallary");
        
        // Update the database with the new image and details
        await ImageGallaryModel.findByIdAndUpdate(id, {
            name,
            email,
            image_url: cloudinaryUploadResult.secure_url,
            public_id: cloudinaryUploadResult.public_id,
        });

        return NextResponse.json(
            { msg: "Image and details updated successfully", data: cloudinaryUploadResult },
            { status: 200 }
        );
    } catch (error) {
        if (error instanceof Error) {
            console.error("Error:", error.message);
            return NextResponse.json({ error: error.message }, { status: 500 });
        } else {
            console.error("Unexpected error:", error);
            return NextResponse.json(
                { error: "An unexpected error occurred" },
                { status: 500 }
            );
        }
    }
};


export const DELETE = async (req: Request, context: { params: { id: string } }) => {
  try {
    // Await the params to resolve
    const { params } = context;
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "Invalid request. No ID provided." },
        { status: 400 }
      );
    }

    // Fetch the user details from the database to retrieve the image public ID
    const userRecord = await ImageGallaryModel.findById(id);

    if (!userRecord) {
      return NextResponse.json(
        { error: "User not found." },
        { status: 404 }
      );
    }

    // Get the Cloudinary image public ID
    const imagePublicId = userRecord.public_id;

    // Delete the image from Cloudinary
    const cloudinaryResult = await DeleteImage(imagePublicId);

    if (cloudinaryResult.result !== "ok") {
      return NextResponse.json(
        { error: "Failed to delete image from Cloudinary." },
        { status: 500 }
      );
    }

    // Delete the user record from the database
    await ImageGallaryModel.findByIdAndDelete(id);

    return NextResponse.json(
      { message: "User and image deleted successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { error: "An error occurred while deleting the user." },
      { status: 500 }
    );
  }
};