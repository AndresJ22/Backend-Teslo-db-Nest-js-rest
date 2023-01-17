import { v4 as uuidv4 } from 'uuid';

export const fileNamer = (req: Express.Request, file: Express.Multer.File, cb: Function) => {
     if (!file) return cb(new Error('No file uploaded'), false);
     const fileExtension = file.mimetype.split('/')[1];
     const fileName = `${uuidv4()}.${fileExtension}`;
     cb(null, fileName);
}