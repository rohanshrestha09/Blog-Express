import Image from "next/image";
import { useRouter } from "next/router";
import { SearchOutlined } from "@ant-design/icons";
import { AiOutlineLogout } from "react-icons/ai";
import { Button } from "antd";

const NavBar = () => {
  const router = useRouter();

  return (
    <div className="sticky top-0 navbar lg:px-40 shadow-md z-10">
      <span
        className="flex-1 font-megrim font-black text-4xl cursor-pointer text-black"
        onClick={() => router.push("/")}
      >
        BlogSansar
      </span>
      <div className="flex-none gap-5">
        <div className="sm:block hidden form-control relative">
          <SearchOutlined className="absolute text-lg left-3 top-1.5 text-slate-600" />

          <input
            type="search"
            placeholder="Search"
            className="input input-bordered h-10 rounded-full pl-9"
          />
        </div>

        <label
          htmlFor="registerModal"
          className="btn modal-button min-h-[2.6rem] h-[2.6rem] leading-none rounded-full"
        >
          Login/Register
        </label>

        {/* <div className="dropdown dropdown-end" data-theme="winter">
          <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
            <div className="w-9 rounded-full">
              <Image
                src="https://placeimg.com/80/80/people"
                alt=""
                height={50}
                width={50}
              />
            </div>
          </label>

          <ul
            tabIndex={0}
            className="mt-3 p-2 shadow menu menu-compact dropdown-content bg-base-100 rounded-box w-52"
          >
            <li>
              <a>
                <Image
                  className="rounded-full"
                  src="https://placeimg.com/80/80/people"
                  alt=""
                  height={20}
                  width={20}
                />{" "}
                Profile
              </a>
            </li>

            <li>
              <a>
                <AiOutlineLogout size={20} /> Logout
              </a>
            </li>
          </ul>
  </div>*/}
      </div>
    </div>
  );
};

export default NavBar;
