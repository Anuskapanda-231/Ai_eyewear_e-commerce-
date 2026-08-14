import { useContext } from "react";
import { ProductContext } from "./ProductContextDefinition";

const useProducts = () => {
  return useContext(ProductContext);
};

export default useProducts;