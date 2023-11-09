import { MigrationInterface, QueryRunner } from "typeorm"

export class AddTheme1697019052469 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query(
        `CREATE TABLE "theme" ("id" character varying NOT NULL PRIMARY KEY, "title" character varying NOT NULL, "thumbnail" character varying, "url" character varying, "description" character varying, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "metadata" jsonb)`
      )
      await queryRunner.query(
        `CREATE TABLE "current_theme" ("id" character varying NOT NULL PRIMARY KEY, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "metadata" jsonb)`
      )
      await queryRunner.query(
        `INSERT INTO "current_theme" ("id", "metadata") VALUES ('1', '{}'::jsonb)`
      )

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query(`DROP TABLE "theme"`)
      await queryRunner.query(`DROP TABLE "current_theme"`)
    }

}
