import { NextPage } from "next";
import dynamic from "next/dynamic";

const Starter = dynamic(import("scenes/Starter"), { ssr: false });

const StarterPage: NextPage = () => {
  return <Starter />;
};

export default StarterPage;
