import { useCallback } from "react";
import { useState } from "react";



const API = "https://dummyjson.com/products/search?q=";

let controller = '';
 function abort() {
   controller && controller.abort();
   controller = null;
   controller = new AbortController();
 }

 let id = 1;
function useNetwork() {

    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState(null);
    


   function getFilteredProducts(query) {
    let myId = ++id;
     setIsLoading(true);
     return fetch(`${API}${encodeURIComponent(query)}`, {
       signal: controller.signal,
     })
       .then((res) => res.json())
       .then((data) => {
         if(myId !== id) {
            console.log('reace');
            return;
         }
         setIsLoading(false);
         setData(data?.products);
       });
   }

   
    return {getFilteredProducts, isLoading, data, abort}
}

export default useNetwork;