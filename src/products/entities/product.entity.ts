import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { ProductImage } from './product-image.entity';
import { User } from '../../auth/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger/dist/decorators';

@Entity({ name: 'products'})
export class Product {
    @ApiProperty({
        example: 'cd0e0c0c-0b1a-4b0c-8c0c-0c0c0c0c0c0c',
        description: 'Unique identifier for the product',
        uniqueItems: true,
    })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty()
    @Column('text', {
        nullable: false,
        unique: true,
    })
    title: string;

    @ApiProperty()
    @Column('numeric', {
        default: 0
    })
    price: number;

    @ApiProperty()
    @Column('text', {
        nullable: true,
    })
    description: string;

    @ApiProperty()
    @Column('text', {
        unique: true,
    })
    slug: string;

    @ApiProperty()
    @Column('int', {
        default: 0
    })
    stock: number;

    @ApiProperty()
    @Column('text', {
        array: true,
    })
    sizes: string[];

    @ApiProperty()
    @Column('text')
    gender: string;

    @ApiProperty()
    @Column({
        type: 'text',
        array: true,
        default:[]
    })
    tags: string[];

    //images
    @OneToMany(
        () => ProductImage,
        (productImage) => productImage.product,
        {
            cascade: true, eager:true}
    )
    images?: ProductImage[];

    @ManyToOne(
        () => User,
        (user) => user.products
    )
    user: User;

    @BeforeInsert()
    checkSlugInsert() {
    if(!this.slug) this.slug = this.title.toLowerCase().replaceAll(' ', '-').replaceAll("'", '');
    }

    @BeforeUpdate()
    checkSlugUpdate() {
        this.slug = this.title.toLowerCase().replaceAll(' ', '-').replaceAll("'", '');
    }
}
