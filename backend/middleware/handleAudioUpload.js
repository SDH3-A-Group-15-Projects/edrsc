import multer from "multer";

const MB = 1024 * 1024
const multerStorage = multer.memoryStorage();

const upload = multer({
    storage: multerStorage,
    limits: {
        fileSize: 10 * MB
    },
    // You could also add fileFilter here for type validation
    /*
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('audio/')) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type, only audio files are allowed!'), false);
        }
    }*/
});

const handleAudioUpload = (req, res, next) => {
    upload.single('audioFile')(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            console.trace();
            return res.status(400).json({ message: `Upload error: ${err.message}`, code: err.code });
        } else if (err) {
            return res.status(400).json({ message: `File processing error: ${err.message}` });
        }
        next();
    });
};

export default handleAudioUpload;
