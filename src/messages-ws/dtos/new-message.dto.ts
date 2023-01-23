import { MinLength, IsString } from 'class-validator';

export class NewMessageDto { 
     @IsString()
     @MinLength(1)
     message: string;
     
}