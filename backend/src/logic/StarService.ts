import { DbService } from '@y-celestial/service';
import { inject, injectable } from 'inversify';
import { ROLE } from 'src/constant/user';
import { Group } from 'src/model/Group';
import {
  EditRecordData,
  PostRecordRequest,
  PutRecordRequest,
  Record,
} from 'src/model/Record';
import {
  GetStarResponse,
  GetStarsResponse,
  PostStarRequest,
  Star,
  StarEntity,
} from 'src/model/Star';
import { v4 as uuidv4 } from 'uuid';
import { RecordService } from './RecordService';
import { UserService } from './UserService';

/**
 * Service class for CRUD stars
 */
@injectable()
export class StarService {
  @inject(DbService)
  private readonly dbService!: DbService;

  @inject(UserService)
  private readonly userService!: UserService;

  @inject(RecordService)
  private readonly recordService!: RecordService;

  public async validateRole(token: string, specificRole: ROLE[]) {
    await this.userService.validateRole(token, specificRole);
  }

  public async addStar(body: PostStarRequest) {
    const star = new StarEntity({
      id: uuidv4(),
      name: body.name,
      nickname: body.nickname,
      birthday: body.birthday,
      dateCreated: Date.now(),
      dateUpdated: Date.now(),
    });

    await this.dbService.createItem(star);

    return star;
  }

  public async removeStar(id: string) {
    await this.dbService.deleteItem('star', id);
  }

  public async getStar(id: string) {
    return await this.dbService.getItem<Star>('star', id);
  }

  public async getStarDetail(id: string): Promise<GetStarResponse> {
    const records = await this.dbService.getItemsByIndex<Record>(
      'record',
      'star',
      id
    );
    const modifiedRecords = records.map((r: Record) => ({
      id: r.id,
      content: r.content,
      dateCreated: r.dateCreated,
      dateUpdated: r.dateUpdated,
      reporter: r.reporter.name,
    }));
    const star = await this.getStar(id);

    return { ...star, records: modifiedRecords };
  }

  public async getStars(): Promise<GetStarsResponse> {
    const stars = await this.dbService.getItems<Star>('star');

    return await Promise.all(
      stars.map(async (star: Star) => {
        const groups = await this.dbService.getItemsByIndex<Group>(
          'group',
          'star',
          star.id
        );

        return { ...star, nGroups: groups.length };
      })
    );
  }

  public async addRecord(body: PostRecordRequest) {
    const reporter = await this.userService.getUserById(body.reporterId);
    const target = await this.getStar(body.targetId);

    return await this.recordService.addRecord(reporter, target, body.content);
  }

  public async editRecord(body: PutRecordRequest) {
    const data: EditRecordData = {
      recordId: body.recordId,
      reporter:
        body.reporterId === undefined
          ? undefined
          : await this.userService.getUserById(body.recordId),
      target:
        body.targetId === undefined
          ? undefined
          : await this.getStar(body.targetId),
      content: body.content,
    };

    return await this.recordService.editRecord(data);
  }
}
