import { MigrationInterface, QueryRunner } from "typeorm"

export class AddArticleAndCategory1690521607982 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query(`CREATE TYPE "article_status_enum" AS ENUM('draft', 'published')`);

      await queryRunner.query(
        `CREATE TABLE "article_category" ("id" character varying NOT NULL, "title" character varying NOT NULL, "handle" character varying, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "metadata" jsonb, CONSTRAINT "16290b0f6e13d99f527bf083" PRIMARY KEY ("id"))`
      )

      await queryRunner.query(`CREATE TABLE "article" ("id" character varying NOT NULL, "title" character varying NOT NULL, "content" character varying, "handle" character varying, "thumbnail" character varying, "status" "article_status_enum" NOT NULL DEFAULT 'draft', "article_category_id" character varying, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "metadata" jsonb, CONSTRAINT "PK_e413392e7763b298e92690bf" PRIMARY KEY ("id"))`);
      await queryRunner.query(
      `ALTER TABLE "article" ADD CONSTRAINT "FK_3fcafeeba5c812875141866c" FOREIGN KEY ("article_category_id") REFERENCES "article_category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
      await queryRunner.query(`CREATE UNIQUE INDEX "IDX_4b26a43aa57f7a752a3d88bd" ON "article" ("handle") `);
      await queryRunner.query(`CREATE UNIQUE INDEX "IDX_d814b0033fa79be8177d79d4" ON "article_category" ("handle") `);

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query(
        `ALTER TABLE "article" DROP CONSTRAINT "FK_3fcafeeba5c812875141866c"`
      )
      await queryRunner.query(`DROP INDEX "IDX_4b26a43aa57f7a752a3d88bd"`);
      await queryRunner.query(`DROP INDEX "IDX_d814b0033fa79be8177d79d4"`);
      await queryRunner.query(`DROP TABLE "article"`)
      await queryRunner.query(`DROP TYPE "article_status_enum"`)
      await queryRunner.query(`DROP TABLE "article_category"`)
    }

}
