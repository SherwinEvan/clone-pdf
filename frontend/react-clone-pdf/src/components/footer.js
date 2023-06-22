import React from "react";
import { Link } from "react-router-dom";
import { mainIcon } from "../data/logo";
import { socialsIcon } from "../data/socials";
import { navLinks } from "../data/navlinks";

export default function Footer() {
  return (
    <footer className="shadow-inner">

      <div className="md:flex md:justify-between items-center md:px-10 px-4 md:pt-0 pt-8">
        <div className="flex-col items-center md:mx-8 md:mb-0 mb-10">
          {mainIcon.map((main) => (
            <Link to={main.link} className="flex cursor-pointer items-center">
              <img
                src={main.icon}
                alt={main.alt}
                className="w-[38px] h-[36px] md:w-[40px] md:h-[38px]"
              />
              <span className="ml-2 text-lg md:text-xl font-bold">{main.name}</span>
            </Link>
          ))}
          <div className="mt-4 md:mt-5">PDF made easy.</div>
        </div>

        <div className="md:flex flex-col md:mb-0 mb-5">
          <ul className="md:mx-8 my-6">
            <span className="font-semibold">Solutions</span>
            {navLinks.map((link) => (
              <li key={link.name} className="md:mb-0 my-6">
                <Link
                  to={link.link}
                  className="md:text-black hover:text-gray-400 duration-500"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex">
          <ul className="md:mx-8 my-6">
            <span className="font-semibold">Support</span>
            <li className="md:mb-2 my-6">
              <Link
                to="/"
                className="md:text-black hover:text-gray-400 duration-500"
              >
                About us
              </Link>
            </li>
            <div className="flex">
              {socialsIcon.map((icons) => (
                <li key={icons.name} className="mr-10 my-10">
                  <Link to={icons.link}>
                    <img
                      src={icons.icon}
                      alt={icons.alt}
                      className="h-[30px] w-[30px]"
                    />
                  </Link>
                </li>
              ))}
            </div>
          </ul>
        </div>
      </div>

      <div className="flex py-5 px-10 text-xs justify-around shadow-inner">
        {mainIcon.map((main) => (
          <Link
            to={main.link}
            className="cursor-pointer items-center hover:underline"
          >
            <span className="">
              {"© " +
                main.name +
                " " +
                new Date().getFullYear() +
                " - MIT License"}
            </span>
          </Link>
        ))}

        <Link to="/" className="cursor-pointer items-center hover:underline">
          <span className="">{"Terms - Privacy Policy"}</span>
        </Link>
      </div>
    </footer>
  );
}
