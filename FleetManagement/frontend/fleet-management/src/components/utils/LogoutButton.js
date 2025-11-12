import { Button } from "@material-tailwind/react";

export const LogoutButton = () => {  

  return (
    <div className="flex w-max gap-4">
      <Button variant="outlined" >Logout</Button> {/* Logout button with navigation */}
    </div>
  );
}