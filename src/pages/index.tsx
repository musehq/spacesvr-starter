import { NextPage } from "next";
import dynamic from "next/dynamic";

const Starter = dynamic(import("scenes/Starter"), { ssr: false });

const LinkTree: NextPage = () => {
  return <Starter />;
};

export default LinkTree;
