import { BeforeInsert, BeforeUpdate, Column, Entity, Generated } from 'typeorm';
import { Sign } from 'src/model/entity/Sign';

@Entity({ name: 'sign' })
export class SignEntity implements Sign {
  @Column({ primary: true, type: 'bigint' })
  @Generated('rowid')
  id!: string;

  @Column({ type: 'text' })
  name!: string;

  @Column({ type: 'text' })
  phone!: string;

  @Column({ type: 'text', default: null })
  line: string | null = null;

  @Column({ type: 'text', name: 'birth_year' })
  birthYear!: string;

  @Column({ type: 'boolean', name: 'is_self' })
  isSelf!: boolean;

  @Column({ type: 'boolean', default: null })
  accompany: boolean | null = null;

  @Column({ type: 'boolean', name: 'can_join', default: null })
  canJoin: boolean | null = null;

  @Column({ type: 'text', default: null })
  comment: string | null = null;

  @Column({ type: 'bigint', name: 'trip_id' })
  tripId!: string;

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
