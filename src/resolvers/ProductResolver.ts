import { Arg, Mutation, Query, Resolver } from 'type-graphql';
import { dataSource } from '..';
import { Product } from '../entities/Product';

@Resolver()
export class ProductResolver {
  @Query(() => [Product])
  async products(): Promise<Product[]> {
    return await Product.find();
  }

  @Mutation(() => Product!)
  async addProduct(
    @Arg('productName') productName: string,
    @Arg('description') description: string,
    @Arg('price') price: number,
    @Arg('numberInStock') numberInStock: number
  ): Promise<Product> {
    const product = Product.create({
      productName,
      description,
      price,
      numberInStock,
    });
    return await product.save();
  }

  @Query(() => Product!, { nullable: true })
  async findProductByID(
    @Arg('productID') productID: string
  ): Promise<Product | undefined | null> {
    return await dataSource.mongoManager.findOneBy(Product, productID);
  }

  @Mutation(() => Product!, { nullable: true })
  async deleteProductByID(
    @Arg('productID') productID: string
  ): Promise<Product | undefined | null> {
    const product = await dataSource.mongoManager.findOneBy(Product, productID);

    if (product) {
      await dataSource.mongoManager.delete(Product, productID);
      return product;
    }
    return null;
  }

  @Mutation(() => Product!)
  async updateProduct(
    @Arg('productID') productID: string,
    @Arg('productName') productName: string,
    @Arg('description') description: string,
    @Arg('price') price: number,
    @Arg('numberInStock') numberInStock: number
  ): Promise<Product | null> {
    let product = await dataSource.mongoManager.findOneBy(Product, productID);
    if (product) {
      product.productName = productName;
      product.description = description;
      product.price = price;
      product.numberInStock = numberInStock;
      await dataSource.mongoManager.update(Product, productID, product);
      return product;
    }
    return null;
  }
}
