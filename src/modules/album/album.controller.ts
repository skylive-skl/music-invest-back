import { Controller, Get, Post, Body, Param, UseGuards, Req, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { AlbumService } from './album.service';
import { CreateAlbumDto } from './dto/create-album.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes, ApiBody } from '@nestjs/swagger';

@ApiTags('Albums')
@Controller('albums')
export class AlbumController {
  constructor(private readonly albumService: AlbumService) {}

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new album' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ARTIST', 'ADMIN')
  @Post()
  async create(@Req() req: any, @Body() createAlbumDto: CreateAlbumDto) {
    return this.albumService.create(req.user.id, createAlbumDto);
  }

  @ApiOperation({ summary: 'Get all albums' })
  @Get()
  async findAll() {
    return this.albumService.findAll();
  }

  @ApiOperation({ summary: 'Get album by ID' })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.albumService.findOne(id);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Upload album cover image' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ARTIST', 'ADMIN')
  @Post(':id/cover')
  @UseInterceptors(FileInterceptor('file')) // using default memory storage to pass buffer directly to S3
  async uploadCover(
    @Param('id') id: string,
    @Req() req: any,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) throw new BadRequestException('File is required');
    return this.albumService.uploadCover(id, req.user.id, file);
  }
}
