import { BeforeInsert, BeforeUpdate, Column, Entity, Generated } from 'typeorm';
import { Status } from 'src/constant/Trip';
import { Trip } from 'src/model/entity/Trip';

@Entity({ name: 'trip' })
export class TripEntity implements Trip {
  @Column({ primary: true, type: 'bigint' })
  @Generated('rowid')
  id!: string;

  @Column({ type: 'text' })
  topic!: string;

  @Column({ type: 'text' })
  ad!: string;

  @Column({ type: 'text' })
  content!: string;

  @Column({ type: 'text' })
  region!: string;

  @Column({ type: 'timestamp' })
  date!: Date;

  @Column({ type: 'timestamp', name: 'meet_date' })
  meetDate!: Date;

  @Column({ type: 'text', name: 'meet_place' })
  meetPlace!: string;

  @Column({ type: 'timestamp', name: 'dismiss_date' })
  dismissDate!: Date;

  @Column({ type: 'text', name: 'dismiss_place' })
  dismissPlace!: string;

  @Column()
  fee!: number;

  @Column({ type: 'text', default: null })
  other: string | null = null;

  @Column({ type: 'text', name: 'owner_name' })
  ownerName!: string;

  @Column({ type: 'text', name: 'owner_phone' })
  ownerPhone!: string;

  @Column({ type: 'text', name: 'owner_line', default: null })
  ownerLine: string | null = null;

  @Column({ type: 'text' })
  code!: string;

  @Column({ type: 'text' })
  status!: Status;

  @Column({ type: 'timestamp', name: 'expired_date', default: null })
  expiredDate: Date | null = null;

  @Column({ type: 'timestamp', name: 'notify_date', default: null })
  notifyDate: Date | null = null;

  @Column({ type: 'text', default: null })
  reason: string | null = null;

  @Column({ type: 'timestamp', name: 'date_created', default: null })
  dateCreated!: Date;

  @Column({ type: 'timestamp', name: 'date_updated', default: null })
  dateUpdated: Date | null = null;

  @BeforeInsert()
  setDateCreated(): void {
    this.dateCreated = new Date();
  }

  @BeforeUpdate()
  setDateUpdated(): void {
    this.dateUpdated = new Date();
  }
}
