import { Contract } from '@algorandfoundation/tealscript';



export class TrailCheq extends Contract {
   // Counter for total products
   productCount = GlobalStateKey<uint64>({ key: 'count' });
    
   // Box storage for multiple products
   products = BoxMap<uint64, string>({ prefix: 'product' }); 
   productNFTs = BoxMap<uint64, AssetID>({ prefix: 'nft' });
   

   createProduct(id: uint64, name: string, description: string, imageURL: string): void {
       // Verify product doesn't exist
       assert(!this.products(id).exists);
        
       // Create NFT for the product
       const nftId = sendAssetCreation({
            configAssetTotal: 1,
            configAssetURL:  imageURL,
            configAssetUnitName: name,
            configAssetName: name,
           configAssetFreeze: this.app.address,
       });
       
       // Store product info
       const productInfo = name + "|" + description + "|" + imageURL;
       this.products(id).value = productInfo;
       this.productNFTs(id).value = nftId;
       
       // Increment product count
       this.productCount.value = this.productCount.value + 1;
   }

   getProduct(id: uint64): [string, AssetID] {
       // Verify product exists
       assert(this.products(id).exists);
       return [
            this.products(id).value,
            this.productNFTs(id).value
        ];
   }

   updateProduct(id: uint64, name: string, description: string): void {
       // Verify product exists
       assert(this.products(id).exists);
       
       // Update product info
       const productInfo = name + "|" + description;
       this.products(id).value = productInfo;
   }


   getProductCount(): uint64 {
       return this.productCount.value;
   }

   clearState(): void {
       // No specific action needed for clear state
       this.productCount.value = 0;
   }
}
