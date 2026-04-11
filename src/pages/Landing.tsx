import { useNavigate } from "react-router-dom";
import RainingLetters from "@/components/ui/modern-animated-hero-section";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <RainingLetters onEnter={() => navigate("/dashboard")} />
  );
};

export default Landing;
