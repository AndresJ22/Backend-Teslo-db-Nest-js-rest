export const fileFilter = (req: Express.Request, file: Express.Multer.File, cb: Function) => {
     if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
          return cb(new Error('Only image files are allowed!'), false);
     }
     cb(null, true);
}