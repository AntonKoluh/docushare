import Navbar from "@/components/navbar/Navbar";
import { loginCheck } from "@/helpers/helpers";
import type { userType } from "@/types/accountType";
import { useEffect, useState } from "react";
import githubLogo from "../../public/github.svg";
import { Link } from "react-router";

const About = () => {
  const [user, setUser] = useState<userType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loginCheck({ setUser, setLoading });
  }, []);

  if (loading)
    return (
      <div className="w-full h-full bg-black">
        <p className="text-4xl text-(--bg-acc-c) text-center">Loading....</p>
      </div>
    );
  return (
    <div className="flex flex-col w-full h-full bg-(--bg-c)/80">
      <Navbar user={user} />
      <div className="w-full flex flex-col justify-center items-center mt-5 gap-5">
        <h2 className="font-bold! flex flex-row gap-3 justify-center items-center">
          Created By: Anton Koluh
          <a href="https://github.com/AntonKoluh">
            <img src={githubLogo} alt="github logo" className="w-5 h-5" />
          </a>
        </h2>
        <Link to="https://github.com/AntonKoluh/docushare">
          <h2 className="font-bold! flex flex-row gap-3 justify-center items-center">
            Project Github{" "}
            <img src={githubLogo} alt="github logo" className="w-5 h-5" />
          </h2>
        </Link>
        <p className="max-w-xl">
          SharedNotes is a pet project designed to explore full-stack
          development using React, Django, and MongoDB. It focuses on
          colloborative, realtime editing with AI assisted tools. The goal of
          the project is to sharpen my skills in modern web technologies, DevOps
          workflows, and database design, while building something practical.
        </p>
        <div className="leading-10">
          <p className="text-center">Technologies used:</p>
          <p className="max-w-xl">
            <span className="text-decoration-line: underline">Frontend</span>:
            React, React router-dom, Tailwind css, Shadcn, Websockets
          </p>
          <p className="max-w-xl">
            <span className="text-decoration-line: underline">Backend</span>:
            Django, DjangoRestApi, JWT, Google OAuth, Websockets
          </p>
          <p className="max-w-xl">
            <span className="text-decoration-line: underline">AI</span>:
            Ollama running the Llama3.2:1b model
          </p>
          <p className="max-w-xl">
            <span className="text-decoration-line: underline">Databases</span>:
            MongoDB, mySQL, Redis
          </p>
          <p className="max-w-xl">
            <span className="text-decoration-line: underline">DevOps</span>: The
            app is hosted on AWS using Amplify and EC2, CloudFare is also used
            in this project.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
