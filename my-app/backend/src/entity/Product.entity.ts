

//entity(class) -> db: table(ProductEntity)

// db migration

import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";
import {Length, Max, Min,} from "class-validator";

@Entity()
export class ProductEntity {

    @PrimaryGeneratedColumn()
    id : number

    @Column()
    @Length(1, 100)
    name: string

    @Column({nullable: false})
    @Min(1)
    @Max(10000)
    price: number

    @Column()
    @Length(1, 20000)
    description: string

    @Column()
    @Length(1, 100)
    color: string

}