// store/cartStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
const SECRET_KEY = '41d04ec38141af599da0a258183a1331b5f1f9f60c7d2ee2e4574810e26982a5';
export interface Product {
  id: string;
  name: string;
  price: number;
  imgurl: string;
  quantity: number;
  totalcostofeachitem: number;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface CartStore {
  cartitems: Product[]

  removeItem: (id: string) => void;
  setCart: (product: Product[]) => void;
  
    
}


const useUserCartStore = create<CartStore>()(persist(
  (set, get) => ({
    cartitems: [],


    setCart: (product: Product[]) => set({
      cartitems: product as any
    }),



    removeItem: (id: string) => set((state: any) => {

      const updatedItems = state.cartitems?.filter((item: Product) => item.id !== id);

      return { cartitems: updatedItems };


    }),


  }),
  {
    name: 'cart-store-user',



  }
));

export default useUserCartStore;
