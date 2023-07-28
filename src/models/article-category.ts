import { BeforeInsert, Column, Entity, Index, OneToMany } from "typeorm"

import { Article } from "./article"
import _ from "lodash"
import { DbAwareColumn, generateEntityId, SoftDeletableEntity } from "@medusajs/medusa"

@Entity()
export class ArticleCategory extends SoftDeletableEntity {
  @Column()
  title: string

  @Index({ unique: true, where: "deleted_at IS NULL" })
  @Column({ nullable: true })
  handle: string

  @OneToMany(() => Article, (article) => article.article_category)
  articles: Article[]

  @DbAwareColumn({ type: "jsonb", nullable: true })
  metadata: Record<string, unknown>

  @BeforeInsert()
  private createHandleIfNotProvided(): void {
    if (this.id) return

    this.id = generateEntityId(this.id, "acate")
    if (!this.handle) {
      this.handle = _.kebabCase(this.title)
    }
  }
}
