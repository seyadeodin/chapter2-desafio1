import { createContext, ReactNode, useContext, useState } from 'react';
import { toast } from 'react-toastify';
import { api } from '../services/api';
import { Product, Stock } from '../types';

interface CartProviderProps {
  children: ReactNode;
}

interface UpdateProductAmount {
  productId: number;
  amount: number;
}

interface CartContextData {
  cart: Product[];
  addProduct: (productId: number) => Promise<void>;
  removeProduct: (productId: number) => void;
  updateProductAmount: ({ productId, amount }: UpdateProductAmount) => void;
}

const CartContext = createContext<CartContextData>({} as CartContextData);

export function CartProvider({ children }: CartProviderProps): JSX.Element {
  const [cart, setCart] = useState<Product[]>(() => {
    const storagedCart = localStorage.getItem('@RocketShoes:cart')

    if (storagedCart) 
       return JSON.parse(storagedCart);

    return [];
  });

  const addProduct = async (productId: number) => {
    let product:Product;
    const response = await api.get(`/products/${productId}`)
    product = response.data
    product.amount = 1
    console.log("produto", product)

    const stockResponse = await api.get(`/stock/${product.id}`)
    const stock = stockResponse.data
    console.log(stock)
    try {
    /*     if (cart.length > 0) {
        cart.map(item => {
          if (item.id === productId){
            console.log('porra')
            item.amount ++
            setCart([...cart])  
          }
          else {
            setCart([...cart, product]) 
          }
        })}
        else{
        setCart([...cart, product])  */
      if (cart.length > 0){
        cart.map(item => {
          if(item.id == product.id && item.amount < stock.amount) product.amount += item.amount
          if(item.id == product.id && item.amount === stock.amount) throw Error
        })
        setCart([...cart.filter(element => product.id !== element.id), product])
      } else {
        setCart([...cart, product])
      }

      } catch(error) {
      console.log('Erro na adição do produto')

    }
  };

  const removeProduct = (productId: number) => {
    try {
      console.log(productId)
      setCart([...cart.filter(element => productId !== element.id)])
        
      
    } catch {
      // TODO
    }
  };


  const updateProductAmount = async ({
    productId,
    amount,
  }: UpdateProductAmount) => {
    try {
      cart.map(item => {
        if(productId == item.id && item.amount > 1){
          item.amount--
          setCart([...cart])
        }
      })
    } catch {
      // TODO
    }
  };

  return (
    <CartContext.Provider
      value={{ cart, addProduct, removeProduct, updateProductAmount }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextData {
  const context = useContext(CartContext);

  return context;
}
