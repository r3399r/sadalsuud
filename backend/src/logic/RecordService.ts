import { DbService } from '@y-celestial/service';
import { inject, injectable } from 'inversify';
import { EditRecordData, Record, RecordEntity } from 'src/model/Record';
import { Star } from 'src/model/Star';
import { User } from 'src/model/User';
import { v4 as uuidv4 } from 'uuid';

/**
 * Service class for CRUD records
 */
@injectable()
export class RecordService {
  @inject(DbService)
  private readonly dbService!: DbService;

  public async addRecord(reporter: User, target: Star, content: string) {
    const record = new RecordEntity({
      id: uuidv4(),
      reporter,
      target,
      content,
      dateCreated: Date.now(),
      dateUpdated: Date.now(),
    });

    await this.dbService.createItem(record);

    return record;
  }

  private async getRecord(recordId: string) {
    return await this.dbService.getItem<Record>('record', recordId);
  }

  public async editRecord(data: EditRecordData) {
    const oldRecord = await this.getRecord(data.recordId);

    const newRecord = new RecordEntity({
      id: oldRecord.id,
      reporter: data.reporter ?? oldRecord.reporter,
      target: data.target ?? oldRecord.target,
      content: data.content,
      dateCreated: oldRecord.dateCreated,
      dateUpdated: Date.now(),
    });

    await this.dbService.putItem(newRecord);

    return newRecord;
  }
}
