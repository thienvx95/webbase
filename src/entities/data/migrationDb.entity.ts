import { prop, modelOptions, Severity } from '@typegoose/typegoose';

import { BaseEntity } from '@entities/base.entity';
import { DataBaseCustomNames } from '@core/enums/dbCustomeNames';

@modelOptions({
  options: {
    allowMixed: Severity.ALLOW,
    customName: DataBaseCustomNames.MigrationDbs,
  },
  schemaOptions: { timestamps: true },
})
export class MigrationDb extends BaseEntity {
  @prop()
  fileName: string;

  @prop()
  appliedAt: string;
}
