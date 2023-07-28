import { 
  BeforeInsert, 
  Column, 
  Entity, 
  JoinColumn, 
  ManyToOne, 
  PrimaryColumn,
} from "typeorm"
import { BaseEntity } from "@medusajs/medusa"
import { DbAwareColumn, generateEntityId } from "@medusajs/medusa/dist/utils"
import { ArticleCategory } from "./article-category"

export enum ArticleStatus {
  DRAFT = "draft",
  PUBLISHED = "published",
}

@Entity()
export class Article extends BaseEntity {
  @Column({ type: "varchar" })
  title: string | null

  @Column({ type: "varchar", unique: true })
  handle: string | null

  @Column({ type: "text", nullable: true })
  thumbnail: string | null

  @Column({ type: "text" })
  content: string | null

  @DbAwareColumn({ type: "enum", enum: ArticleStatus, default: "draft" })
  status: ArticleStatus

  @DbAwareColumn({ type: "jsonb", nullable: true })
  metadata: Record<string, unknown> | null

  @Column({ type: "text", nullable: true })
  article_category_id: string | null

  @ManyToOne(() => ArticleCategory)
  @JoinColumn({ name: "article_category_id" })
  article_category: ArticleCategory

  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "post")
  }
}
