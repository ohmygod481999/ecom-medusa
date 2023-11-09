import {
  DbAwareColumn,
  generateEntityId,
  SoftDeletableEntity,
} from '@medusajs/medusa';
import {BeforeInsert, Column, Entity, Index} from 'typeorm';

// export interface Theme {
//   id: string
//   thumbnail: string
//   name: string
//   description: string
//   url: string
// }

export interface ThemeList {
  themes: Theme[];
  current_theme: string;
}

@Entity()
export class Theme extends SoftDeletableEntity {
  @Column({type: 'varchar'})
  title: string | null;

  @Column({type: 'varchar'})
  url: string;

  @Column({type: 'text', nullable: true})
  thumbnail: string | null;

  @Column({type: 'text'})
  description: string | null;

  @DbAwareColumn({type: 'jsonb', nullable: true})
  metadata: Record<string, unknown> | null;

  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, 'theme');
  }
}
