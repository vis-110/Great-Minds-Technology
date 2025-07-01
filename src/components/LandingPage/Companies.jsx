import { companyLogo1,companyLogo2,companyLogo3,companyLogo4 } from "../../assets";
import React from "react";

const Companies = () => {
  return (
    <div className="w-full bg-white py-[50px]">
      <div className=" md:max-w-[1480px] m-auto  px-4">
        <h1 className="text-center text-2xl font-bold text-[#536e96]">Trusted by over 25,000 teams around the world.</h1>
        <p className="text-center text-[#536e96] text-xl py-4">Leading companies use the same courses to help employees keep their skills fresh.</p>
        <div className="flex justify-center py-8 md:gap-8 ">
        <div className="grid md:grid-cols-4 grid-cols-2 gap-2">
            <img src={companyLogo1} />
            <img src={companyLogo2} />
            <img src={companyLogo3} />
            <img src={companyLogo4} />
            

        </div>
        </div>
      </div>
    </div>
  );
};

export default Companies;
