// Define the type for the result of the image upload
// export interface UploadImageResult {
//     secure_url: string;
//     public_id: string;
//   }
  
  export interface CloudinaryUploadResult {
    secure_url: string;
    public_id: string;
    format: string;
    width: number;
    height: number;
    // Other known properties...
}
