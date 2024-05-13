import { AppDataSource } from "./data-source";
import { port } from "./config";
import app from './app';

AppDataSource.initialize()
  .then(async () => {
    try {
      // start express server
      app.listen(port, () => {
        console.log(
          `Express server has started on port ${port}. Open http://localhost:${port}/users to see results`
        );
      });
    } catch (error) {
      console.error("An error occurred during initialization:", error);
    }
  })
  .catch((error) => console.log(error));
