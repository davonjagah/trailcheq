import { Contract } from '@algorandfoundation/tealscript';



export class TrailCheq extends Contract {
   // Counter for total products
   productCount = GlobalStateKey<uint64>({ key: 'count' });
    
   // Box storage for multiple products
   products = BoxMap<uint64, string>();
   

   createProduct(id: uint64, name: string, description: string): void {
       // Verify product doesn't exist
       assert(!this.products(id).exists);
       
       // Store product as concatenated string
       const productInfo = name + "|" + description;
       this.products(id).value = productInfo;
       
       // Increment product count
       this.productCount.value = this.productCount.value + 1;
   }

   getProduct(id: uint64): string {
       // Verify product exists
       assert(this.products(id).exists);
       return this.products(id).value;
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
