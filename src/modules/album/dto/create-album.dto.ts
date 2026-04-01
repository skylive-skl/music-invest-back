import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateAlbumDto {
  @ApiProperty({ description: 'Title of the album', example: 'Nevermind' })
  @IsString()
  @IsNotEmpty()
  title: string;
}
