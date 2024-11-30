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
