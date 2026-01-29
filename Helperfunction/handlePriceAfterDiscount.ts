export const handleDiscount=(discountPercentage:number,actualprice:number)=>{
    let discountprice=Math.floor(actualprice/100*discountPercentage)
    let priceafterDiscount=actualprice - discountprice

    return priceafterDiscount
  
}