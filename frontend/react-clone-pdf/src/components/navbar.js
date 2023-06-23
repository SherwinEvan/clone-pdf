import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";
import { navLinks } from "../data/navlinks";
import GetUser from "../service/getUser";
import { mainIcon } from "../data/logo";
import BurgerMenu from "../assets/BurgerMenu.png";
import BurgerMenuClose from "../assets/BurgerMenuClose.png";
import DeleteSessionCookie from "../service/deleteSessionCookie";

function handleLogout() {
  DeleteSessionCookie();
  window.location.reload(false);
}

export default function NavBar() {
  const [currUser, setCurrUser] = useState(null);
  const [burgerOpen, setBurgerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const user = await GetUser();
      setCurrUser(user);
      setIsLoading(false);
    };

    fetchData();
  }, []);

  return (
    <nav className="shadow-md w-full relative">
      <div
        className={`flex items-center justify-between bg-white py-4 pl-10 ${
          currUser === "Guest" ? "pr-10" : "pr-5"
        }`}
      >
        <div className="flex items-center">
          {mainIcon.map((main) => (
            <Link to={main.link} className="flex cursor-pointer items-center">
              <img
                src={main.icon}
                alt={main.alt}
                className="w-[40px] h-[38px]"
              />
              <span className="ml-2 text-xl font-bold">{main.name}</span>
            </Link>
          ))}
        </div>

        <div
          onClick={() => setBurgerOpen(!burgerOpen)}
          className="z-10 absolute right-8 top-6 cursor-pointer md:hidden"
        >
          <img
            src={burgerOpen ? BurgerMenuClose : BurgerMenu}
            alt="BurgerMenu"
            className="h-[35px] w-[35px]"
          />
        </div>

        {burgerOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-90 z-20"
            onClick={() => setBurgerOpen(false)}
          ></div>
        )}

        <ul
          className={`md:flex md:pr-0 md:items-center md:pb-0 pb-12 absolute md:static md:z-auto left-0 right-0 w-full md:w-auto md:pl-0 px-10 transition-all duration-500 ease-in ${
            burgerOpen ? "top-20" : "top-[-490px]"
          }`}
          style={{ zIndex: burgerOpen ? 30 : "auto" }}
        >
          {navLinks.map((link) => (
            <li key={link.name} className="md:mx-8 md:my-0 my-8">
              <Link
                to={link.link}
                className="md:text-gray-800 text-neutral-200  hover:text-gray-400 duration-500"
              >
                {link.name}
              </Link>
            </li>
          ))}
          {!isLoading && (
            <li>
              <div className="md:hidden">
                {currUser === "Guest" || currUser === "Error" ? (
                  <Button fullWidth variant="contained">
                    <Link to="/login">Sign In</Link>
                  </Button>
                ) : (
                  <div className="relative">
                    <p className="group flex items-center">
                      <span
                        className="cursor-pointer"
                        onClick={() => {
                          window.location.href = "/account";
                        }}
                      >
                        Hello {currUser}
                      </span>
                      <Button
                        className="ml-2"
                        variant="outlined"
                        size="small"
                        onClick={handleLogout}
                      >
                        Logout
                      </Button>
                    </p>
                  </div>
                )}
              </div>
            </li>
          )}
        </ul>
        {!isLoading && (
          <div className="hidden md:block">
            {currUser === "Guest" || currUser === "Error" ? (
              <Button fullWidth variant="contained">
                <Link to="/login">Sign In</Link>
              </Button>
            ) : (
              <div className="relative">
                <p className="group">
                  <span className="mr-5">
                    <a href="/account">Hello {currUser}</a>
                  </span>
                  <span span className="">
                    <Button
                      className=""
                      variant="outlined"
                      onClick={handleLogout}
                    >
                      Logout
                    </Button>
                  </span>
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
