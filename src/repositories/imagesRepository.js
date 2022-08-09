import { connection } from "../dbStrategy/postgres/postgres.js";

export class ImagesRepository {
  static async createImage(url) {
    const query = {
      text: "INSERT INTO images (url) VALUES ($1) RETURNING id",
      values: [url],
    };

    return connection.query(query);
  }
}
