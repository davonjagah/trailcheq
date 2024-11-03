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

      createProduct(
            id: string,
            name: string,
            description: string,
            category: string,
            imageURL: string,
            owner: string,
            created: uint64
      ): ProductInfo {
     

            // Verify product doesn't already exist
            assert(!this.products(id).exists, 'Product already exists');

            // Create NFT
            const nftId = sendAssetCreation({
                  configAssetTotal: 1,
                  configAssetURL: imageURL,
                  configAssetUnitName: name.substring(0, 8), // Ensure unit name isn't too long
                  configAssetName: name.substring(0, 32), // Ensure asset name isn't too long
                  configAssetFreeze: this.app.address
            });

            // Create product info
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

            // Store product information
            this.products(id).value = productInfo;
            this.productNFTs(id).value = nftId;
            
            // Store product ID in index
            const currentCount = this.productCount.value;
            this.productKeys(currentCount).value = id;

            // Increment counter
            this.productCount.value = currentCount + 1;
            return productInfo;
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
      this.productCount.value = this.productCount.value - 1;
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