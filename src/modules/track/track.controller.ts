import { Controller, Get, Post, Body, Param, UseGuards, Req, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { TrackService } from './track.service';
import { CreateTrackDto } from './dto/create-track.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes, ApiBody } from '@nestjs/swagger';

@ApiTags('Tracks')
@Controller('tracks')
export class TrackController {
  constructor(private readonly trackService: TrackService) {}

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new track metadata' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ARTIST', 'ADMIN')
  @Post()
  async create(@Req() req: any, @Body() createTrackDto: CreateTrackDto) {
    return this.trackService.create(req.user.id, createTrackDto);
  }

  @ApiOperation({ summary: 'Get all tracks' })
  @Get()
  async findAll() {
    return this.trackService.findAll();
  }

  @ApiOperation({ summary: 'Get track by ID' })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.trackService.findOne(id);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Upload track audio file' })
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
  @Post(':id/audio')
  @UseInterceptors(FileInterceptor('file')) // passes file.buffer directly
  async uploadAudio(
    @Param('id') id: string,
    @Req() req: any,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) throw new BadRequestException('File is required');
    return this.trackService.uploadAudio(id, req.user.id, file);
  }
}
