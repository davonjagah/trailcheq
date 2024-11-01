import { Contract } from '@algorandfoundation/tealscript';


interface ProductInfo {
      name: string;
      description: string;
      category: string;
      imageURL: string;
      owner: string;
      checked: boolean;
      createdTimeStamp: uint64;
      updatedTimeStamp: uint64;
}


export class TrailCheq extends Contract {
      // Global counter for the total number of products
      productCount = GlobalStateKey<uint64>({ key: 'count' });

      // Box storage for products
      products = BoxMap<string, ProductInfo>({ prefix: 'product' });
      productNFTs = BoxMap<string, AssetID>({ prefix: 'nft' });

      // Stores each productId by an incremental index
      productKeys = BoxMap<uint64, string>({ prefix: 'keys' });

      // Function to create a new product
      createProduct(id: string, name: string, description: string, category: string, imageURL: string, owner: string, created: uint64): [ProductInfo, AssetID] {


            // Verify product doesn't already exist
            assert(!this.products(id).exists);

            // Placeholder for NFT creation logic
            const nftId = sendAssetCreation({
                  configAssetTotal: 1,
                  configAssetURL: imageURL,
                  configAssetUnitName: name,
                  configAssetName: name,
                  configAssetFreeze: this.app.address,
            });

            const productInfo: ProductInfo = {
                  name: name,
                  description: description,
                  imageURL: imageURL,
                  category: category,
                  owner: owner,
                  checked: false,
                  createdTimeStamp: created,
                  updatedTimeStamp: 0
            };
            this.products(id).value = productInfo;
            this.productNFTs(id).value = nftId;
            // Add the productId to the indexed list
            this.productKeys(this.productCount.value).value = id;

            // Increment product count
            this.productCount.value += 1;

            return [
                  productInfo,
                  nftId
            ]
      }

      // Function to verify and mark a product as checked
      verifyProduct(id: string): [ProductInfo, AssetID] {


            // Verify product exists and is not yet checked
            assert(this.products(id).exists);
            assert(!this.products(id).value.checked);

            // Retrieve and update product information
            const productInfo = this.products(id).value;
            productInfo.checked = true;
            this.products(id).value = productInfo;  // Reassign updated product

            return [productInfo, this.productNFTs(id).value];
      }

      // Function to update a product's information
      updateProduct(id: string, name: string, description: string, updated: uint64): void {


            // Verify product exists
            assert(this.products(id).exists);

            // Update product info
            const productInfo = this.products(id).value;
            productInfo.name = name;
            productInfo.description = description;
            productInfo.updatedTimeStamp = updated;

            this.products(id).value = productInfo;
      }

      // Function to delete a product
      deleteProduct(id: string): void {


            // Verify product exists
            assert(this.products(id).exists);

            // Delete product and associated NFT information
            this.products(id).delete();
            this.productNFTs(id).delete();
            this.productKeys(this.productCount.value - 1).delete();

            // Decrement product count
            this.productCount.value -= 1;
      }

      // Retrieve a product by its unique product ID
      getProductById(productId: string): ProductInfo {
            assert(this.products(productId).exists);  // Ensure the product exists
            return this.products(productId).value;
      }

      // Retrieve a product ID by its index
      getProductIdByIndex(index: uint64): string {
            assert(index < this.productCount.value);  // Ensure index is valid
            return this.productKeys(index).value;
      }
}
