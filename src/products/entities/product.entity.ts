import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { ProductImage } from './product-image.entity';
import { User } from '../../auth/entities/user.entity';

@Entity({ name: 'products'})
export class Product {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text', {
        nullable: false,
        unique: true,
    })
    title: string;

    @Column('numeric', {
        default: 0
    })
    price: number;

    @Column('text', {
        nullable: true,
    })
    description: string;

    @Column('text', {
        unique: true,
    })
    slug: string;

    @Column('int', {
        default: 0
    })
    stock: number;

    @Column('text', {
        array: true,
    })
    sizes: string[];

    @Column('text')
    gender: string;

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
