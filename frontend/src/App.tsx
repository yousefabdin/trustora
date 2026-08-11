import Button from "./components/atoms/Button/Button";
import { Icon } from "@iconify/react";
import StatusBadge from "./components/molecules/statusBadges/StatusBadges";
function App() {
  return (
    <>
      <StatusBadge className="my-3" variant="Pending"></StatusBadge>
    </>
  );
}

export default App;
