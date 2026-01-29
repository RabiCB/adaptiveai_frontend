type createAt={

    nanoseconds: number;
    sec: number;
  
}

export const getformatDate = (dateString: any) => {
  const options = { year: "numeric", month: "long", day: "numeric" };
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", options as any);
};


export const getformatDatewithMonth = (dateString:createAt) => {
  const options = { month: "long", day: "numeric" };
  const seconds = dateString?.sec;
  const nanoseconds = dateString?.nanoseconds
  const timestampInMillis = seconds * 1000 + Math.floor(nanoseconds / 1e6); // Convert nanoseconds to milliseconds
  const date = new Date(timestampInMillis);
  return date.toLocaleDateString("en-US", options as any);
};
