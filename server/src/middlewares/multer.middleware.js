import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./public/temp");
    },
    filename: function (req, file, cb) {
        const fileExtension = path.extname(file.originalname);
        const randomSequence = Math.floor(Math.random() * 1000000);
        cb(null, `${Date.now()}-${randomSequence}${fileExtension}`);
    },
});

export const upload = multer({ storage });
