import { fileFilter, fileNamer } from './helpers';
import { Controller, Get, Post, Param, Delete, UploadedFile, UseInterceptors, Res, StreamableFile } from '@nestjs/common';
import { diskStorage } from 'multer';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express/multer';
import { createReadStream } from 'fs';
import { ConfigService } from '@nestjs/config';
import { ApiTags } from '@nestjs/swagger/dist';

@ApiTags('Files')
@Controller('files')
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
    private readonly configService: ConfigService
  ) { }
/** 
 * ! This is the only endpoint that works.
*/ 
  @Get('product/:imageName')
  findProductImage(
    @Res() res,
    @Param('imageName') imageName: string) {
    const path = this.filesService.getStaticProductImage(imageName);
     res.sendFile(path);
    // const stream = createReadStream(this.filesService.getStaticProductImage(imageName));
    // return new StreamableFile(stream);
  }
  
  @Post('product')
  @UseInterceptors(FileInterceptor('file', {
    fileFilter: fileFilter,
    // limits: {
    //   fileSize: 1024 * 1024 * 5,
    // }
    storage: diskStorage({
      destination: './static/uploads',
      filename: fileNamer
    })
  }))
  uploadProductImage(
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      return {
        message: 'No file uploaded',
      };
    }
    const secureUrl = `${this.configService.get('HOST_API')}/files/product/${file.filename}`;
    return { secureUrl };
  }
}
