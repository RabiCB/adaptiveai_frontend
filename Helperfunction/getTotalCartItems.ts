export const getTotalCartItems=(cart:any)=>{
    
    let totaItems=cart ? cart?.reduce((curr:any,next:any)=>curr+(next.quantity),0):null


    return  totaItems
}