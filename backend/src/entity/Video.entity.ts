import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class VideoEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    filename: string;

    @Column()
    path: string;
}
