import express from "express";
import cors from "cors";

import CartRoutes from "./routes/cart.Routes.js";
import ProductRoutes from "./routes/product.Routes.js";
import UserRoutes from "./routes/user.Routes.js";
import PurchaseOrderRoutes from "./routes/purchaseOrder.Routes.js";
const app = express();

const corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());

app.use(CartRoutes);
app.use(ProductRoutes);
app.use(UserRoutes);
app.use(PurchaseOrderRoutes);

export default app;
