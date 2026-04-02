import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class FilterProjectDto {
  @ApiPropertyOptional({ description: 'Filter projects by artist ID' })
  @IsOptional()
  @IsString()
  artistId?: string;
}
