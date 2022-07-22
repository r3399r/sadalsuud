import { ViewColumn, ViewEntity } from 'typeorm';
import { Status } from 'src/constant/Trip';
import { ViewTripDetail } from './ViewTripDetail';

@ViewEntity({ name: 'v_trip_detail' })
export class ViewTripDetailEntity implements ViewTripDetail {
  @ViewColumn()
  id!: string;

  @ViewColumn()
  uuid!: string;

  @ViewColumn()
  topic!: string;

  @ViewColumn({ name: 'meet_date' })
  meetDate!: Date;

  @ViewColumn({ name: 'owner_name' })
  ownerName!: string;

  @ViewColumn({ name: 'owner_phone' })
  ownerPhone!: string;

  @ViewColumn({ name: 'owner_line' })
  ownerLine!: string | null;

  @ViewColumn()
  code!: string;

  @ViewColumn()
  status!: Status;

  @ViewColumn()
  count!: string;

  @ViewColumn({ name: 'date_created' })
  dateCreated!: Date;

  @ViewColumn({ name: 'date_updated' })
  dateUpdated!: Date;
}
