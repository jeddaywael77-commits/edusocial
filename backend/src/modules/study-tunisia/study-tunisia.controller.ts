import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { StudyTunisiaService } from './study-tunisia.service';
import { CreateInstitutionDto } from './dto/create-institution.dto';
import { CreateProgramDto } from './dto/create-program.dto';
import { CreateGuideDto } from './dto/create-guide.dto';
import { CreateAdmissionDto } from './dto/create-admission.dto';
import { CreateScholarshipDto } from './dto/create-scholarship.dto';
import { CreateQuestionDto, CreateAnswerDto } from './dto/create-question.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Study Tunisia')
@Controller('study-tunisia')
export class StudyTunisiaController {
  constructor(private readonly studyService: StudyTunisiaService) {}

  // ─── Institutions ──────────────────────────────────────────────────────────

  @Post('institutions')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create an institution' })
  async createInstitution(@Body() dto: CreateInstitutionDto) {
    return this.studyService.createInstitution(dto);
  }

  @Get('institutions')
  @ApiOperation({ summary: 'List institutions' })
  @ApiQuery({ name: 'type', required: false })
  @ApiQuery({ name: 'city', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'cursor', required: false })
  @ApiQuery({ name: 'limit', required: false })
  async findAllInstitutions(
    @Query('type') type?: string,
    @Query('city') city?: string,
    @Query('search') search?: string,
    @Query('cursor') cursor?: string,
    @Query('limit') limit?: number,
  ) {
    return this.studyService.findAllInstitutions({ type, city, search, cursor, limit });
  }

  @Get('institutions/:id')
  @ApiOperation({ summary: 'Get institution details' })
  @ApiParam({ name: 'id' })
  async findInstitutionById(@Param('id') id: string) {
    return this.studyService.findInstitutionById(id);
  }

  @Put('institutions/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Update institution' })
  @ApiParam({ name: 'id' })
  async updateInstitution(
    @Param('id') id: string,
    @Body() dto: Partial<CreateInstitutionDto>,
  ) {
    return this.studyService.updateInstitution(id, dto);
  }

  @Delete('institutions/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete institution' })
  @ApiParam({ name: 'id' })
  async deleteInstitution(@Param('id') id: string) {
    return this.studyService.deleteInstitution(id);
  }

  // ─── Programs ──────────────────────────────────────────────────────────────

  @Post('programs')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a study program' })
  async createProgram(@Body() dto: CreateProgramDto) {
    return this.studyService.createProgram(dto);
  }

  @Get('programs')
  @ApiOperation({ summary: 'List programs' })
  @ApiQuery({ name: 'field', required: false })
  @ApiQuery({ name: 'level', required: false })
  @ApiQuery({ name: 'institutionId', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'cursor', required: false })
  @ApiQuery({ name: 'limit', required: false })
  async findAllPrograms(
    @Query('field') field?: string,
    @Query('level') level?: string,
    @Query('institutionId') institutionId?: string,
    @Query('search') search?: string,
    @Query('cursor') cursor?: string,
    @Query('limit') limit?: number,
  ) {
    return this.studyService.findAllPrograms({ field, level, institutionId, search, cursor, limit });
  }

  @Get('programs/:id')
  @ApiOperation({ summary: 'Get program details' })
  @ApiParam({ name: 'id' })
  async findProgramById(@Param('id') id: string) {
    return this.studyService.findProgramById(id);
  }

  @Put('programs/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Update program' })
  @ApiParam({ name: 'id' })
  async updateProgram(
    @Param('id') id: string,
    @Body() dto: Partial<CreateProgramDto>,
  ) {
    return this.studyService.updateProgram(id, dto);
  }

  @Delete('programs/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete program' })
  @ApiParam({ name: 'id' })
  async deleteProgram(@Param('id') id: string) {
    return this.studyService.deleteProgram(id);
  }

  // ─── Guides ────────────────────────────────────────────────────────────────

  @Post('guides')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a study guide' })
  async createGuide(
    @CurrentUser('sub') userId: string,
    @Body() dto: CreateGuideDto,
  ) {
    return this.studyService.createGuide(userId, dto);
  }

  @Get('guides')
  @ApiOperation({ summary: 'List study guides' })
  @ApiQuery({ name: 'category', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'cursor', required: false })
  @ApiQuery({ name: 'limit', required: false })
  async findAllGuides(
    @Query('category') category?: string,
    @Query('search') search?: string,
    @Query('cursor') cursor?: string,
    @Query('limit') limit?: number,
  ) {
    return this.studyService.findAllGuides({ category, search, cursor, limit });
  }

  @Get('guides/:id')
  @ApiOperation({ summary: 'Get guide details' })
  @ApiParam({ name: 'id' })
  async findGuideById(@Param('id') id: string) {
    return this.studyService.findGuideById(id);
  }

  @Put('guides/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Update guide' })
  @ApiParam({ name: 'id' })
  async updateGuide(
    @Param('id') id: string,
    @CurrentUser('sub') userId: string,
    @Body() dto: Partial<CreateGuideDto>,
  ) {
    return this.studyService.updateGuide(id, userId, dto);
  }

  @Delete('guides/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete guide' })
  @ApiParam({ name: 'id' })
  async deleteGuide(
    @Param('id') id: string,
    @CurrentUser('sub') userId: string,
  ) {
    return this.studyService.deleteGuide(id, userId);
  }

  // ─── Admissions ────────────────────────────────────────────────────────────

  @Post('admissions')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create admission info' })
  async createAdmission(@Body() dto: CreateAdmissionDto) {
    return this.studyService.createAdmission(dto);
  }

  @Get('admissions')
  @ApiOperation({ summary: 'List admissions' })
  @ApiQuery({ name: 'institutionId', required: false })
  @ApiQuery({ name: 'cursor', required: false })
  @ApiQuery({ name: 'limit', required: false })
  async findAllAdmissions(
    @Query('institutionId') institutionId?: string,
    @Query('cursor') cursor?: string,
    @Query('limit') limit?: number,
  ) {
    return this.studyService.findAllAdmissions({ institutionId, cursor, limit, isOpen: true });
  }

  @Get('admissions/:id')
  @ApiOperation({ summary: 'Get admission details' })
  @ApiParam({ name: 'id' })
  async findAdmissionById(@Param('id') id: string) {
    return this.studyService.findAdmissionById(id);
  }

  @Put('admissions/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Update admission' })
  @ApiParam({ name: 'id' })
  async updateAdmission(
    @Param('id') id: string,
    @Body() dto: Partial<CreateAdmissionDto>,
  ) {
    return this.studyService.updateAdmission(id, dto);
  }

  @Delete('admissions/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete admission' })
  @ApiParam({ name: 'id' })
  async deleteAdmission(@Param('id') id: string) {
    return this.studyService.deleteAdmission(id);
  }

  // ─── Scholarships ──────────────────────────────────────────────────────────

  @Post('scholarships')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create scholarship' })
  async createScholarship(@Body() dto: CreateScholarshipDto) {
    return this.studyService.createScholarship(dto);
  }

  @Get('scholarships')
  @ApiOperation({ summary: 'List scholarships' })
  @ApiQuery({ name: 'institutionId', required: false })
  @ApiQuery({ name: 'cursor', required: false })
  @ApiQuery({ name: 'limit', required: false })
  async findAllScholarships(
    @Query('institutionId') institutionId?: string,
    @Query('cursor') cursor?: string,
    @Query('limit') limit?: number,
  ) {
    return this.studyService.findAllScholarships({ institutionId, cursor, limit, isAvailable: true });
  }

  @Get('scholarships/:id')
  @ApiOperation({ summary: 'Get scholarship details' })
  @ApiParam({ name: 'id' })
  async findScholarshipById(@Param('id') id: string) {
    return this.studyService.findScholarshipById(id);
  }

  @Put('scholarships/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Update scholarship' })
  @ApiParam({ name: 'id' })
  async updateScholarship(
    @Param('id') id: string,
    @Body() dto: Partial<CreateScholarshipDto>,
  ) {
    return this.studyService.updateScholarship(id, dto);
  }

  @Delete('scholarships/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete scholarship' })
  @ApiParam({ name: 'id' })
  async deleteScholarship(@Param('id') id: string) {
    return this.studyService.deleteScholarship(id);
  }

  // ─── Q&A ───────────────────────────────────────────────────────────────────

  @Post('questions')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Ask a question' })
  async createQuestion(
    @CurrentUser('sub') userId: string,
    @Body() dto: CreateQuestionDto,
  ) {
    return this.studyService.createQuestion(userId, dto);
  }

  @Get('questions')
  @ApiOperation({ summary: 'List questions' })
  @ApiQuery({ name: 'tag', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'cursor', required: false })
  @ApiQuery({ name: 'limit', required: false })
  async findAllQuestions(
    @Query('tag') tag?: string,
    @Query('search') search?: string,
    @Query('cursor') cursor?: string,
    @Query('limit') limit?: number,
  ) {
    return this.studyService.findAllQuestions({ tag, search, cursor, limit });
  }

  @Get('questions/:id')
  @ApiOperation({ summary: 'Get question details' })
  @ApiParam({ name: 'id' })
  async findQuestionById(@Param('id') id: string) {
    return this.studyService.findQuestionById(id);
  }

  @Post('questions/:id/answers')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Answer a question' })
  @ApiParam({ name: 'id' })
  async createAnswer(
    @Param('id') id: string,
    @CurrentUser('sub') userId: string,
    @Body() dto: CreateAnswerDto,
  ) {
    return this.studyService.createAnswer(userId, id, dto);
  }

  @Post('answers/:id/accept')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Accept an answer' })
  @ApiParam({ name: 'id' })
  async acceptAnswer(
    @Param('id') id: string,
    @CurrentUser('sub') userId: string,
  ) {
    return this.studyService.acceptAnswer(id, userId);
  }
}
