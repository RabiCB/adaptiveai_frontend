export const InStockAlert=(quantity:number)=>{
switch (quantity){
    case 0:
        return "Out of Stock"
    case 1:
        return "Only 1 left"
    case 2:
        return "only 2 left"
    default:
        return " "
 
}
}