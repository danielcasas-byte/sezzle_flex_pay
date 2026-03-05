import { useState } from "react";
import StoreLanding from "@/components/StoreLanding";
import FlexPayCheckout from "@/components/FlexPayCheckout";

const Index = () => {
  const [screen, setScreen] = useState("store");

  if (screen === "checkout") {
    return <FlexPayCheckout onBack={() => setScreen("store")} />;
  }

  return <StoreLanding onCheckout={() => setScreen("checkout")} />;
};

export default Index;
