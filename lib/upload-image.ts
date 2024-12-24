import cloudinary from "./cloudinary";

// Define a more specific type for the result properties
interface CloudinaryUploadResult {
    secure_url: string;
    public_id: string;
    [key: string]: unknown; // Replace 'any' with 'unknown'
}

export const UploadImage = async (file: File, folder: string): Promise<CloudinaryUploadResult> => {
    const buffer = await file.arrayBuffer();
    const bytes = Buffer.from(buffer);

    return new Promise((resolve, reject) => {
        cloudinary.uploader
            .upload_stream(
                {
                    resource_type: "auto",
                    folder: folder,
                },
                (err, result) => {
                    if (err) {
                        return reject(err.message);
                    }
                    if (result) {
                        resolve(result as CloudinaryUploadResult); // Type assertion is still safe here
                    }
                }
            )
            .end(bytes);
    });
};

export const DeleteImage = async (public_id: string): Promise<{ result: string }> => {
    return new Promise(async (resolve, reject) => {
        try {
            const result = await cloudinary.uploader.destroy(public_id);
            console.log("Cloudinary response:", result); // Log the response
            resolve(result);
        } catch (error: unknown) {
            // Check if the error is an instance of Error
            if (error instanceof Error) {
                console.error("Error from Cloudinary:", error.message); // Log the error message
                reject(new Error(error.message || "An error occurred while deleting the image"));
            } else {
                console.error("Unknown error:", error);
                reject(new Error("An unknown error occurred while deleting the image"));
            }
        }
    });
};
