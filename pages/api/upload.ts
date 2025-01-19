import { NextApiRequest, NextApiResponse } from 'next';
import formidable, { Fields, Files } from 'formidable';
import fs from 'fs';
import path from 'path';

export const config = {
    api: {
        bodyParser: false,
    },
};

const uploadDir = path.join(process.cwd(), '/uploads');

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const form = new formidable.IncomingForm({
        uploadDir,
        keepExtensions: true,
        maxFileSize: 5 * 1024 * 1024, // 5MB file size limit
        filter: ({ mimetype }) => !!mimetype && mimetype.startsWith('image/'), // Only allow image files
    });

    form.parse(req, (err: Error, fields: Fields, files: Files) => {
        if (err) {
            return res.status(500).json({ message: 'Error parsing the files' });
        }

        const file = Array.isArray(files.file) ? files.file[0] : files.file;
        if (!file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }
        const filePath = path.join(uploadDir, file.newFilename);

        fs.rename(file.filepath, filePath, (err) => {
            if (err) {
                return res.status(500).json({ message: 'Error saving the file' });
            }

            res.status(200).json({ message: 'File uploaded successfully', filePath });
        });
    });
};

export default handler;