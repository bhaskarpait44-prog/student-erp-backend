import cors from "cors";

const corsOptions = {
  origin: "*", // later we will restrict
  credentials: true,
};

export default cors(corsOptions);
