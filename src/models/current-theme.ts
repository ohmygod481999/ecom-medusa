import { DbAwareColumn, SoftDeletableEntity } from "@medusajs/medusa";
import { BaseEntity, Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class CurrentTheme extends BaseEntity {
  @PrimaryColumn()
  id: string;

  @DbAwareColumn({type: 'jsonb', nullable: true})
  metadata: Record<string, unknown> | null;
}

