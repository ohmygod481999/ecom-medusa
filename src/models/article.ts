import {
  BeforeInsert,
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import {SoftDeletableEntity} from '@medusajs/medusa';
import {DbAwareColumn, generateEntityId} from '@medusajs/medusa/dist/utils';
import {ArticleCategory} from './article-category';
import _ from "lodash"

export enum ArticleStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
}

@Entity()
export class Article extends SoftDeletableEntity {
  @Column({type: 'varchar'})
  title: string | null;

  @Index({unique: true, where: 'deleted_at IS NULL'})
  @Column({type: 'text', nullable: true})
  handle: string | null;

  @Column({type: 'text', nullable: true})
  thumbnail: string | null;

  @Column({type: 'text'})
  content: string | null;

  @DbAwareColumn({type: 'enum', enum: ArticleStatus, default: 'draft'})
  status: ArticleStatus;

  @DbAwareColumn({type: 'jsonb', nullable: true})
  metadata: Record<string, unknown> | null;

  @Column({type: 'text', nullable: true})
  article_category_id: string | null;

  @ManyToOne(() => ArticleCategory)
  @JoinColumn({name: 'article_category_id'})
  article_category: ArticleCategory;

  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, 'post');

    if (!this.handle) {
      this.handle = _.kebabCase(this.title);
    }
  }
}
