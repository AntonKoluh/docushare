import useGetData from "~/hooks/useGetData";
import GetStartedBtn from "../common/btnGetStarted";

export default function Welcome() {
  const getData = useGetData();

  const handleCheckLogin = async () => {
    const result = await getData("test/");
    console.log(result);
  };

  return (
    <div className="w-fit h-full mx-auto max-w-7xl flex flex-col justify-start items-center p-10">
      <p className="mt-15">
        <span className="text-purple-600">- </span>
        Name
        <span className="text-purple-600"> -</span>
      </p>
      <h1 className="text-center mt-5">
        Real-time, collaborative,
        <br /> AI assisted notes!
      </h1>
      <p className="mt-26 text-center w-full">
        Edit, view and present your work in real time.
      </p>
      <p className="mt-6 text-center w-full">
        AI tools to assist you and your team, saving time and money.
      </p>
      <h3 className="mt-20 text-center w-full">Get Started Now:</h3>
      <div className="mt-5 text-left w-full flex flex-col gap-5 justify-center items-center">
        <GetStartedBtn />
        {/* <button className={clsx("btn", "secondary")}>Sign up</button> */}
        <button onClick={handleCheckLogin}>Check login</button>
      </div>
    </div>
  );
}
