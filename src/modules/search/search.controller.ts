import { Controller, Get, Query, BadRequestException } from '@nestjs/common';
import { SearchService } from './search.service';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';

@ApiTags('Search')
@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @ApiOperation({ summary: 'Global search across tracks, albums, artists and projects' })
  @ApiQuery({ name: 'q', description: 'Search query', example: 'nirvana' })
  @ApiQuery({
    name: 'type',
    required: false,
    isArray: true,
    enum: ['track', 'album', 'artist', 'project'],
    description: 'Entity types to search. Defaults to all types.',
    example: 'track,album',
  })
  @Get()
  async search(
    @Query('q') q: string,
    @Query('type') type?: string | string[],
  ) {
    if (!q || q.trim().length < 2) {
      throw new BadRequestException('Query param "q" must be at least 2 characters');
    }

    const allTypes = ['track', 'album', 'artist', 'project'];

    let types: string[];
    if (!type) {
      types = allTypes;
    } else {
      const raw = Array.isArray(type) ? type : type.split(',');
      types = raw.map((t) => t.trim().toLowerCase()).filter((t) => allTypes.includes(t));
      if (types.length === 0) {
        throw new BadRequestException(`Invalid type(s). Allowed: ${allTypes.join(', ')}`);
      }
    }

    return this.searchService.search(q.trim(), types);
  }
}
