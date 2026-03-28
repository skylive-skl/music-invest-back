import { Controller, Get, Post, Body, Param, UseGuards, Req, UseInterceptors, UploadedFile, UploadedFiles, BadRequestException } from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { multerOptions } from '../../common/config/multer.config';

@Controller('projects')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ARTIST', 'ADMIN')
  @Post()
  async create(@Req() req: any, @Body() createProjectDto: CreateProjectDto) {
    return this.projectService.create(req.user.id, createProjectDto);
  }

  @Get()
  async findAll() {
    return this.projectService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.projectService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ARTIST', 'ADMIN')
  @Post(':id/cover')
  @UseInterceptors(FileInterceptor('file', multerOptions))
  async uploadCover(
    @Param('id') id: string,
    @Req() req: any,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) throw new BadRequestException('File is required');
    return this.projectService.uploadCover(id, req.user.id, file);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ARTIST', 'ADMIN')
  @Post(':id/media')
  @UseInterceptors(FilesInterceptor('files', 10, multerOptions))
  async uploadMedia(
    @Param('id') id: string,
    @Req() req: any,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    if (!files || files.length === 0) throw new BadRequestException('Files are required');
    return this.projectService.uploadMedia(id, req.user.id, files);
  }
}
