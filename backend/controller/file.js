import { File } from "../model/file.js";

export const getFiles = async (req, res) => {
  try {
    const files = await File.find({ folderId: req.params.folderId });
    if (files) {
      return res.status(200).json(files);
    } else {
      return res.status(500).json("Folder has not been created");
    }
  } catch (error) {}
};

export const uploadFiles = async (req, res) => {
  try {
    const { file, fileName, folderId } = req.body;

    if (file === null || fileName === null || folderId === null)
      return res.status(500).json("value is null");

    const newFile = new File({ file, fileName, folderId });
    const fileData = await newFile.save();
    res.status(200).json(fileData);
  } catch (error) {
    console.log(error);
  }
};

export const editFile = async (req, res) => {
  try {
    const { id } = req.params;
    const deleteFolder = await File.findByIdAndDelete(id);

    if (!deleteFolder) return res.status(500).json("File not found");

    res.status(200).json(deleteFolder);
  } catch (error) {
    console.log(error);
  }
};


export const deleteFile = async (req, res) => {};

// ... existing imports

// ... existing imports and Mongoose model import

// export const downloadFile = async (req, res, next) => {
//     try {
//         const { id } = req.params;
//         // 1. Find the file record in your MongoDB
//         const fileData = await File.findById(id); 

//         if (!fileData) {
//             return next(createError(404, "File not found")); 
//         }

//         const fileUrl = fileData.file; 

//         // 2. CRITICAL STEP: Use res.redirect()
//         // The browser is redirected to the file's external URL (Cloudinary).
//         // Since Cloudinary serves the URL with download headers, the browser starts the download.
//         return res.redirect(fileUrl); 
        
//     } catch (error) {
//         console.error("Error during file download:", error);
//         next(error); 
//     }
// };


export const downloadFile = async (req, res, next) => {
    try {
        const { id } = req.params;
        const fileData = await File.findById(id); 

        if (!fileData) {
            return next(createError(404, "File not found")); 
        }

        let fileUrl = fileData.file; 

        // 🚨 CRITICAL CHANGE: Manipulate the Cloudinary URL to force download (attachment flag)
        // Insert 'fl_attachment/' right after '/upload/' in the URL path.
        // Example: 
        // Before: .../upload/v123456/sample.pdf
        // After:  .../upload/fl_attachment/v123456/sample.pdf
        // const uploadPath = '/upload/';
        // if (fileUrl.includes(uploadPath)) {
        //     fileUrl = fileUrl.replace(uploadPath, `${uploadPath}fl_attachment/`);
        // } else {
        //     // Fallback: If URL structure is unexpected, log a warning
        //     console.warn("Could not find '/upload/' path to insert attachment flag.");
        // }
                const uploadPath = '/upload/';
        if (fileUrl.includes(uploadPath)) {
            // Find the index right after '/upload/'
            const index = fileUrl.indexOf(uploadPath) + uploadPath.length;

            // Insert 'fl_attachment/' at that index
            fileUrl = fileUrl.slice(0, index) + 'fl_attachment/' + fileUrl.slice(index);
        }



        // Redirect the client to the modified Cloudinary URL
        return res.redirect(fileUrl); 
        
    } catch (error) {
        // Log the error and pass it to the error handler middleware
        console.error("Error during file download:", error);
        next(error); 
    }
};

// ... existing code ...


// ... existing exports (getFiles, uploadFiles, editFile, deleteFile)
