import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateTrackDto {
  @ApiProperty({ description: 'Title of the track', example: 'Smells Like Teen Spirit' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: 'Album ID representing the relation to the album', example: 'uuid-string' })
  @IsString()
  @IsNotEmpty()
  albumId: string;
}
