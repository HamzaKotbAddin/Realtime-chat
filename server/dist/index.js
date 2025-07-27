"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const database_js_1 = require("./config/database.js");
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const contact_routes_1 = __importDefault(require("./routes/contact.routes"));
const socket_1 = __importDefault(require("./socket"));
const message_routes_1 = __importDefault(require("./routes/message.routes"));
const channel_routes_1 = __importDefault(require("./routes/channel.routes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
console.log(port);
app.use((0, cors_1.default)({
    credentials: true,
    origin: process.env.ORIGIN,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
}));
app.use("/uploads/profiles", express_1.default.static("uploads/profiles"));
app.use("/uploads/files", express_1.default.static("uploads/files"));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
app.get("/", (req, res) => {
    res.send("✅ API is running");
});
app.use("/api/auth", auth_routes_1.default);
app.use("/api/contacts", contact_routes_1.default);
app.use("/api/messages", message_routes_1.default);
app.use("/api/channel", channel_routes_1.default);
async function main() {
    await (0, database_js_1.connectToDB)();
    const server = app.listen(port, () => {
        console.log(`✅ Server is running at http://localhost:${port}, accepting requests from ${process.env.ORIGIN}`);
    });
    (0, socket_1.default)(server);
}
main().catch((error) => {
    console.error("Error starting server:", error);
    process.exit(1);
});
