import { Elysia, t } from "elysia";
import { renderEjs } from "../pages/services/pages.service";
import postControllers from "./controllers/post.controller";
import storyControllers from "./controllers/story.controller"
import {Post, PostPlain, PostInputCreate} from "../../generated/prismabox/Post";


const apiRoutes = new Elysia({ prefix: "/api" });

apiRoutes.get("/posts", postControllers.list);
apiRoutes.post("/posts", postControllers.create, {
    body: PostInputCreate})

apiRoutes.get("/stories", storyControllers.list);

export default apiRoutes;
