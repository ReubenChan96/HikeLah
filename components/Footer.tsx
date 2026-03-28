export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <>
      <hr className="border-[#ACACAC] mt-8" />
      <div className="container mx-auto px-4">
        <p className="text-right text-[16px] text-black mb-1">A TechUp Project by: Reuben Chan</p>
        <p className="text-right text-[#767676]">Last Updated: {year}</p>
      </div>
      <br />
      <div className="container mx-auto px-4 pb-6">
        <p className="text-[10px] text-[#a9a9a9]">
          Disclaimer: This website is created for learning purposes only. The information provided here should not be
          considered professional advice. Please note that we make no guarantees regarding the accuracy, completeness,
          or reliability of the contents of this website. Any actions you take based on the contents of this website
          are at your own risk. We are not liable for any losses or damages incurred from the use of this website.
        </p>
      </div>
    </>
  );
}
