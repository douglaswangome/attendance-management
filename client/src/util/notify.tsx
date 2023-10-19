import { toast } from "react-hot-toast";

const notify = (status: number | string, message: string): void => {
  if (status === 200) {
    toast.success(message);
  } else if (status === "") {
    toast(message);
  } else {
    toast.error(message);
  }
};

export default notify;
