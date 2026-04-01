import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsDateString, IsOptional } from 'class-validator';

export class CreateAlbumDto {
  @ApiProperty({ description: 'Title of the album', example: 'Nevermind' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: 'Release date of the album (ISO 8601)', example: '2025-06-01', required: false })
  @IsOptional()
  @IsDateString()
  releaseDate?: string;
}
